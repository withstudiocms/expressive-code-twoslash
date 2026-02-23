// @ts-nocheck
// @errors: 2540
console.log((1 + 2 + 3 + 4).toFixed(2));
//                            ^|

/** A Basic Todo interface*/
interface Todo {
	title: string;
}

const todo: Readonly<Todo> = {
	title: "Delete inactive users",
	//  ^?
};

todo.title = "Hello";
