# $ compep

> Auto compile and running your C++, Python code. and test sample case output.

![https://user-images.githubusercontent.com/2284908/31326947-8df7ad4e-ad06-11e7-99a4-ca013d5804f2.gif](https://user-images.githubusercontent.com/2284908/31326947-8df7ad4e-ad06-11e7-99a4-ca013d5804f2.gif)


## Usage C++
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


## Usage Python

1. Run the `compep --init-py`.

2. Edit `testcase/main.testcase.txt` for question.

3. Be coding `main.py`.


```
├── main.py
└── testcase
    └── main.testcase.txt
```

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
		--init-py Generate workspace python
```


## License

MIT © [elzup](https://elzup.com)
