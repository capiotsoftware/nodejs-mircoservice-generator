# Swagger Code Generatory


Swagger code generator takes a fixed set of arguments through the command line interface and creates a micro service with five operations being Create, List, Show, Delete, Update. It takes in a configuration file as an input and generates a mongoose as well as swagger definition along with it.


## Getting Started

To get started clone the repo and run the command node bin/codeGenerator.js along with the configuration file.


### Prerequisites

We need a minimum of Nodejs 6 to run the project on a stable environment. It's better to have swagger installed globally.


### Installing

git clone git@bitbucket.org:capiot/codegen.git

## Configuration File

The configuration file takes in a JSON Object with an array called list, the list element contains an object with three elements in it name, sequence and fields. Fields is an array which will contain all the fields. Name will be the name of the definition in the swagger.yaml file and the mongoose definition. All the services associated with this object will start at localhost:portNumber/{projectName}/v1/{name}, here the projectName will be taken as an argument over the command line and the name is the part of the configuration file.

Here's the configuration file:- 

```
{
    "name":"Ifsc",
    "collectionName":"IFSC",
    "modelName":"IFSC",
    "definition":{
        "_id":{"type":"String"},
        "ifsc_code":{"type":"String", "enum":["value1", "value2"]},
        "bank_name":{"type":"String", "unique":true},
        "branch_address":{"type":"String", "required":true},
        "complexObject":{
            "definition":{
                "field1":{"type":"String"},
                "field2":{"type":"Number", "enum":[1,2,3,4]}
            }
        },
        "complexObjectArray":[{
            "definition":{
                "field1":{"type":"String","default":"Abcd"},
                "field2":{"type":"Number"}
            }
        }], 
        "simpleArray":[{
            "type":"String"
        }]
    }
}

```

```
node bin/codeGenerator.js
```

## Versioning

Version 1.0.0
## Authors

* **Apurv Jain** - *Initial work* - [Apurv Jain](https://bitbucket.org/apurv_capiot/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* swagger-node