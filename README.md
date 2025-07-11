### [shopify cli 官方文档](https://shopify.dev/docs/themes/tools/cli/commands)

<br>

### dev - 开发环境

```sh
npm run dev

# 每次的代码变动 会实时更新到shopify后台
```

### pull - 拉取最新线上版本

```sh
npm run pull

# 拉去线上最新live版本
```


### push - 主题提交

```sh
shopify theme push --unpublished -s urtopia.myshopify.com -t [模板名或者版本号]

# 一般情况下可能用不到
# 因为在开发模式下，代码会实时同步到shopify后台
# 如果你想要在本地模板的基础上 copy 出新的模板，可以使用这个命令
```


### publish - 主题发布

```sh
shopify theme publish -s urtopia.myshopify.com

# 这个命令会直接发布到线上，请谨慎😃

```
