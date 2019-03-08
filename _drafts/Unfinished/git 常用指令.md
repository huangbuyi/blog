
## Github
### create new repository
```
echo "# temp-test" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/user/repository.git
git push -u origin master
```

### push an exisiting repository from the command line
```
git remote add origin https:github.com/user/repository.git
git push -u origin master
```
