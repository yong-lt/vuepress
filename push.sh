#!/usr/bin/env sh

# # 确保在执行中抛出错误
# set -e

# # 删除之前打包的文件 
# rm -rf ./docs/.vuepress/dist/*

# # 打包
# npm run docs:build

# 推送仓库
git add .
git commit -m "更新"
git push origin main
