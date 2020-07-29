# URL Shortner

URL Shortner is a demo repository for Shorting URL. You can find the specification in this [link](https://en.wikipedia.org/wiki/URL_shortening)

## Use CodePipeline to excute CI/CD

CodePipeline is a AWS CI/CD tool. Here is the [details](https://docs.aws.amazon.com/codepipeline/index.html)

## Environments

Not all the components are defined in SAM template. 

- Preview [https://portal.sname.be](https://portal.sname.be)
- Certificate : portal.sname.be/api.sname.be
- Route 59 Domain : sname.be
- Amplify : Host static html files. index.html in ./public/index.html
- Other components are generate with SAM/CloudFormation ./template.yaml


## Structure

```
├── LICENSE
├── README.md
├── buildspec.yml
├── events
├── public
│   └── index.html
├── samconfig.toml
├── src
│   ├── app.js
│   ├── db.js
│   ├── package-lock.json
│   ├── package.json
│   ├── short.js
│   └── url.js
├── swagger.yaml
├── template.yaml
└── tests
    └── unit
```

## Amplify

Navigate to public folder. you can find the index.html file. this is the file 