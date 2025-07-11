class EnhancedTableControls {
    constructor(tableId) {
        this.table = document.getElementById(tableId);
        this.wrapper = this.table.closest(".table-wrapper");
        this.dropdownButton = this.wrapper.querySelector(".dropdown-button");
        this.dropdownContent = this.wrapper.querySelector(".dropdown-content");
        this.switchButton = this.wrapper.querySelector(".switch-button");

        // 配置参数
        this.fixedColumnsCount = parseInt(this.table.dataset.fixedColumns || "1");
        this.maxMobileColumns = parseInt(this.table.dataset.maxMobileColumns || "2");
        this.maxDesktopColumns = parseInt(this.table.dataset.maxDesktopColumns || "5");
        this.showFirstColumnMobile = !this.table.classList.contains("hide-first-column-mobile");

        // 状态管理
        this.columnStates = new Map();
        this.currentColumns = [];
        this.hiddenColumns = [];
        this.currentMode = null; // 'mobile' 或 'desktop'

        // 绑定方法
        this.handleDropdownClick = this.handleDropdownClick.bind(this);
        this.handleSwitchClick = this.handleSwitchClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.isAnimating = false; // 防止动画过程中重复触发
        // 初始化
        this.init();
    }

    init() {
        const isMobile = window.innerWidth <= 768;
        // 只在对应模式下初始化
        if (
            this.currentMode === null ||
            (isMobile && this.currentMode === "desktop") ||
            (!isMobile && this.currentMode === "mobile")
        ) {
            this.currentMode = isMobile ? "mobile" : "desktop";
            this.initializeColumnStates();
            this.bindEvents();
            if (isMobile) {
                this.setupMobileControls();
            } else {
                this.setupDesktopControls();
            }
            this.getHeadheight();
            this.updateTableColumns();
        }
    }
    getHeadheight() {
        const announcement = document.querySelector(".shopify-section--announcement-bar");
        const header = document.querySelector("header");
        const tableHead = document.querySelector(".thead");
        // console.log(header);
        
        // tableHead.style.top = header.offsetHeight + (announcement.offsetHeight - 1) + "px";
    }
    initializeColumnStates() {
        const headerCells = Array.from(this.table.querySelectorAll("thead th"));
        const isMobile = this.currentMode === "mobile";

        this.columnStates.clear();
        this.hiddenColumns = [];

        headerCells.forEach((cell, index) => {
            if (isMobile) {
                if (this.showFirstColumnMobile) {
                    const isFixed = index < this.fixedColumnsCount;
                    const shouldBeVisible = index < this.maxMobileColumns;

                    this.columnStates.set(index, {
                        index,
                        isFixed,
                        text: cell.textContent.trim(),
                        visible: shouldBeVisible,
                    });
                } else {
                    const isFixed = index > 0 && index <= this.fixedColumnsCount;
                    const shouldBeVisible = index === 1 || index === 2;

                    this.columnStates.set(index, {
                        index,
                        isFixed,
                        text: cell.textContent.trim(),
                        visible: shouldBeVisible && index > 0,
                    });
                }
            } else {
                // PC端逻辑
                const isFixed = index < this.fixedColumnsCount;
                const shouldBeVisible = index < this.maxDesktopColumns;

                this.columnStates.set(index, {
                    index,
                    isFixed,
                    text: cell.textContent.trim(),
                    visible: shouldBeVisible,
                });
            }
        });

        // 初始化当前列顺序
        this.currentColumns = Array.from(this.columnStates.keys());
    }

    handleResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        this.resizeTimeout = setTimeout(() => {
            const isMobile = window.innerWidth <= 768;
            const newMode = isMobile ? "mobile" : "desktop";

            // 只有当模式发生改变时才重新初始化
            if (this.currentMode !== newMode) {
                this.init();
            }
        }, 250);
    }

    handleDropdownClick() {
        if (this.currentMode === "mobile") {
            this.dropdownContent.hidden = !this.dropdownContent.hidden;
        }
    }

    handleSwitchClick() {
        if (this.currentMode === "desktop") {
            this.handleNext();
        }
    }

    handleOutsideClick(event) {
        if (!this.wrapper.contains(event.target)) {
            this.dropdownContent.hidden = true;
        }
    }

    bindEvents() {
        // 移除旧的事件监听
        if (this.dropdownButton) {
            this.dropdownButton.removeEventListener("click", this.handleDropdownClick);
        }
        if (this.switchButton) {
            this.switchButton.removeEventListener("click", this.handleSwitchClick);
        }
        document.removeEventListener("click", this.handleOutsideClick);
        window.removeEventListener("resize", this.handleResize);

        // 添加新的事件监听
        if (this.dropdownButton) {
            this.dropdownButton.addEventListener("click", this.handleDropdownClick);
        }
        if (this.switchButton) {
            this.switchButton.addEventListener("click", this.handleSwitchClick);
        }
        document.addEventListener("click", this.handleOutsideClick);
        window.addEventListener("resize", this.handleResize);
    }

    setupMobileControls() {
        if (!this.dropdownContent) return;
        document.querySelectorAll("table").forEach((item) => {
            item.addEventListener("click", () => {
                console.log(this.dropdownContent.hidden);

                let hidden = this.dropdownContent.getAttribute("hidden");
                if (!hidden) {
                    this.dropdownContent.hidden = true;
                }
                console.log("click");
            });
        });
        this.createDropdownOptions();
        const hasMoreColumns = Array.from(this.columnStates.values()).length > 2;
        this.dropdownButton.style.display = hasMoreColumns ? "" : "none";
        if (this.switchButton) {
            this.switchButton.style.display = "none";
        }
    }

    setupDesktopControls() {
        if (!this.switchButton) return;

        const hasEnoughColumns = this.getHeaderCount() > this.maxDesktopColumns;
        this.switchButton.style.display = hasEnoughColumns ? "" : "none";
        if (this.dropdownButton) {
            this.dropdownButton.style.display = "none";
        }
    }

    createDropdownOptions() {
        if (!this.dropdownContent) return;

        this.dropdownContent.innerHTML = "";
        const columns = Array.from(this.columnStates.values());
        const isSecondColumnFixed = !this.showFirstColumnMobile && this.fixedColumnsCount > 1;

        // 确定要在下拉菜单中显示的列
        const columnsToShow = columns.filter((column) => {
            if (this.showFirstColumnMobile) {
                // 当显示第一列时，只显示非固定列的选项
                return column.index >= this.fixedColumnsCount;
            } else {
                // 当不显示第一列时，显示第二列之后的非固定列选项
                return column.index > this.fixedColumnsCount - 1;
            }
        });

        const getVisibleNonFixedCount = () => {
            return columns.filter((col) => !col.isFixed && col.visible).length;
        };

        columnsToShow.forEach((column) => {
            const option = document.createElement("button");
            option.type = "button";
            option.className = "dropdown-option";

            const isActive = column.visible;
            if (isActive) {
                option.classList.add("active");
            }

            const optionContent = document.createElement("div");
            optionContent.className = "dropdown-option-content";

            const text = document.createElement("span");
            text.textContent = column.text;
            optionContent.appendChild(text);

            // 创建 checkmark 元素（无论是否激活）
            const checkmark = document.createElement("span");
            checkmark.className = "checkmark";
            checkmark.innerHTML = "✓";
            if (isActive) {
                checkmark.style.display = "";
            } else {
                checkmark.style.display = "none";
            }
            optionContent.appendChild(checkmark);

            option.appendChild(optionContent);

            option.addEventListener("click", (e) => {
                e.stopPropagation();

                const currentFixedVisible = columns.filter((col) => col.isFixed && col.visible).length;
                const maxNonFixed = this.maxMobileColumns - currentFixedVisible;

                if (this.showFirstColumnMobile || isSecondColumnFixed) {
                    // 单选模式
                    if (!column.visible) {
                        // 只有在选择新列时才切换
                        columnsToShow.forEach((col) => {
                            const isSelected = col.index === column.index;
                            this.columnStates.get(col.index).visible = isSelected;
                            // 更新checkmark显示状态
                            const colOption = this.dropdownContent.querySelector(`[data-index="${col.index}"]`);
                            if (colOption) {
                                const checkmark = colOption.querySelector(".checkmark");
                                if (checkmark) {
                                    checkmark.style.display = isSelected ? "" : "none";
                                }
                            }
                        });
                    }
                    // 如果点击已选中的列，保持选中状态
                } else {
                    // 多选模式
                    if (!column.visible) {
                        // 要显示新列
                        const visibleNonFixed = getVisibleNonFixedCount();
                        if (visibleNonFixed >= maxNonFixed) {
                            // 如果已达到最大显示数，隐藏最早的非固定可见列
                            const firstVisibleNonFixed = columns.find(
                                (col) => !col.isFixed && col.visible && col.index !== column.index
                            );
                            if (firstVisibleNonFixed) {
                                this.columnStates.get(firstVisibleNonFixed.index).visible = false;
                                // 更新被隐藏列的checkmark
                                const hiddenOption = this.dropdownContent.querySelector(`[data-index="${firstVisibleNonFixed.index}"]`);
                                if (hiddenOption) {
                                    const checkmark = hiddenOption.querySelector(".checkmark");
                                    if (checkmark) {
                                        checkmark.style.display = "none";
                                    }
                                }
                            }
                        }
                        this.columnStates.get(column.index).visible = true;
                        checkmark.style.display = "";
                    } else {
                        // 如果是已选中的列，只有在有多个选中时才允许取消
                        const visibleNonFixed = getVisibleNonFixedCount();
                        if (visibleNonFixed > 1) {
                            this.columnStates.get(column.index).visible = false;
                            checkmark.style.display = "none";
                        }
                    }
                }

                this.dropdownContent.hidden = true;
                this.applyColumnStates();
            });

            // 添加数据属性以便后续查找
            option.dataset.index = column.index;
            this.dropdownContent.appendChild(option);
        });
    }

    applyColumnStates() {
        const rows = this.table.querySelectorAll("tr");

        rows.forEach((row) => {
            const cells = row.children;
            Array.from(cells).forEach((cell, index) => {
                const state = this.columnStates.get(index);
                if (state) {
                    cell.classList.toggle("hidden-column", !state.visible);
                }
            });
        });

        // 控制下拉按钮的显示
        if (this.dropdownButton) {
            const columns = Array.from(this.columnStates.values());
            const hasMoreColumns = columns.length > 2;
            this.dropdownButton.style.display = hasMoreColumns ? "" : "none";
        }
    }
    updateTableColumns() {
        const rows = this.table.querySelectorAll("tr");
        const isMobile = this.currentMode === "mobile";
        const maxVisibleColumns = isMobile ? this.maxMobileColumns + 1 : this.maxDesktopColumns;

        rows.forEach((row) => {
            const cells = Array.from(row.children);
            const newOrder = [];

            this.currentColumns.forEach((columnIndex, index) => {
                if (columnIndex < cells.length) {
                    const cell = cells[columnIndex];
                    const state = this.columnStates.get(columnIndex);

                    if (state && state.visible && index < maxVisibleColumns) {
                        cell.classList.remove("hidden-column");
                    } else {
                        cell.classList.add("hidden-column");
                    }

                    newOrder.push(cell);
                }
            });

            row.innerHTML = "";
            newOrder.forEach((cell) => row.appendChild(cell));
        });
    }

    getHeaderCount() {
        return this.table.querySelectorAll("thead th").length;
    }
    handleNext() {
        if (!this.isAnimating) {
            this.isAnimating = true;

            const allColumns = Array.from(this.columnStates.entries());
            const fixedColumns = allColumns
                .filter(([_, state]) => state.index < this.fixedColumnsCount)
                .map(([index]) => index);
            const movableColumns = allColumns
                .filter(([_, state]) => state.index >= this.fixedColumnsCount)
                .map(([index]) => index);
            if (movableColumns.length > 1) {
                const headers = this.table.querySelectorAll("thead tr th");

                // 1. 先处理显示/隐藏
                const firstNonFixedHeader = headers[this.fixedColumnsCount];
                const newVisibleHeader = headers[this.maxDesktopColumns];

                // 隐藏第一个非固定列
                firstNonFixedHeader.classList.add("hidden-column");
                // 显示新列
                newVisibleHeader.classList.remove("hidden-column");

                // 2. 使用 requestAnimationFrame 确保 DOM 更新后再添加动画
                requestAnimationFrame(() => {
                    // 对所有可见的非固定列添加滑动动画
                    headers.forEach((header, index) => {
                        if (index > this.fixedColumnsCount && index < this.maxDesktopColumns + 1) {
                            header.classList.add("sliding");
                        }
                    });
                });

                // 3. 更新列顺序
                const firstMovable = movableColumns.shift();
                movableColumns.push(firstMovable);

                // 4. 更新可见性状态
                const maxVisible = this.maxDesktopColumns;
                movableColumns.forEach((columnIndex, idx) => {
                    const state = this.columnStates.get(columnIndex);
                    state.visible = idx < maxVisible - fixedColumns.length;
                });

                // 5. 动画结束后更新
                setTimeout(() => {
                    this.currentColumns = [...fixedColumns, ...movableColumns];
                    this.updateTableColumns();
                    headers.forEach((header) => {
                        header.classList.remove("sliding");
                    });
                    this.isAnimating = false;
                }, 300);
            }
        }
    }

    destroy() {
        if (this.dropdownButton) {
            this.dropdownButton.removeEventListener("click", this.handleDropdownClick);
        }
        if (this.switchButton) {
            this.switchButton.removeEventListener("click", this.handleSwitchClick);
        }
        document.removeEventListener("click", this.handleOutsideClick);
        window.removeEventListener("resize", this.handleResize);

        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
    }
}

// 初始化表格控件
document.addEventListener("DOMContentLoaded", () => {
    const tables = document.querySelectorAll('[id^="Table-"]');
    tables.forEach((table) => new EnhancedTableControls(table.id));
});
