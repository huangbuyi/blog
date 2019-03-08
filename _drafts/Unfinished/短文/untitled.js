function Singleton() {

	if(typeof Singleton.instance === "object") {
		return Singleton.instance
	}

	Singleton.instance = this
}

var s1 = new Singleton()
var s2 = new Singleton()
console.log(s1 === s2)