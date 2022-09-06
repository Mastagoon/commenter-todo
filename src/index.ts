import { program } from "commander"
import chalk from "chalk"
import Conf from "conf"

const TODO_VAR = "todo-list"
const conf = new Conf()

const getList = () => (conf.get(TODO_VAR) as Todo[]) ?? []
const saveList = (list: Todo[]) => conf.set(TODO_VAR, list)

export type Todo = {
  name: string
  done: boolean
}

const list = () => {
  const todoList = getList()
  if (todoList && todoList.length) {
    console.log(
      chalk.blue.bold(
        "Tasks in green are done. Tasks in yellow are still not done."
      )
    )
    return todoList.forEach((t, i) =>
      console.log(
        `${
          t.done
            ? chalk.greenBright(`${i + 1}. ${t.name}`)
            : chalk.yellowBright(`${i + 1}. ${t.name}`)
        }`
      )
    )
  }
  console.log(chalk.red.bold(`You don't have any tasks yet.`))
}

const add = (name: string) => {
  let list = getList()
  if (!list) list = []
  list.push({ name, done: false })
  saveList(list)
  console.log(chalk.green.bold(`${name} has been added to your todo list.`))
}

const done = ({ tasks }: { tasks?: string[] }) => {
  let list = getList()
  if (list) {
    list = list.map((t, i) => {
      if (!tasks) {
        console.log(chalk.green.bold(`${t.name} has been marked as done.`))
        return { ...t, done: true }
      }
      if (tasks.indexOf(i.toString()) !== -1) {
        console.log(chalk.green.bold(`${t.name} has been marked as done.`))
        return { ...t, done: true }
      }
      return t
    })
  }
  saveList(list)
  console.log(chalk.green.bold("Tasks have been marked as done successfully"))
}

program.command("list").description("List todo tasks").action(list)
program.command("add <task>").description("Add a todo task").action(add)
program
  .command("done")
  .description("Mark a todo task as done")
  .option(
    "-t, --tasks <tasks...>",
    "The tasks to mark done. If not specified, all tasks will be marked done."
  )
  .action(done)

program.parse()
