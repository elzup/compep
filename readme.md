# compep [![Build Status](https://travis-ci.org/elzup/compep.svg?branch=master)](https://travis-ci.org/elzup/compep)

> Auto compile and running your C++ code. and test sample case output.

## Usage
1. Run the `compep`.

2. Edit `testcase/main.testcase.txt` for question.

3. Be coding `main.cpp`.


```
├── main.cpp
├── out
│   └── main.out
└── testcase
    └── main.testcase.txt
```

Testcase input/output formt.

testcase/main.testcase.txt

```
input values of case1
----
output values of case1
====
input values of case2
----
output values of case2
```

There's room for consideration.

## CLI

```
$ npm install --global compep
```

```
$ compep --help
	Usage
	  $ compep

	Options:
		--init Generate workspace
```


## License

MIT © [elzup](https://elzup.com)
