#!/usr/bin/env sh

# 确保在执行中抛出错误
set -e

# 删除之前打包的文件 
rm -rf ./docs/.vuepress/dist/*

# 打包
npm run docs:build

cd ./docs/.vuepress/dist/

# 推送仓库
git init
git add .
git commit -m "build"
git branch -M main
git remote add origin https://github.com/1425821290/yong-lt.github.io.git
git push origin main
