// let randomArr = [...new Array(256)].map(() => Math.random() * 1000)

// asyncLimit(randomArr, function (item, index) {
//   console.log(`index: ${index}    start`)
//   console.time(`index: ${index}`)

//   return new Promise((res, rej) => {
//     setTimeout(() => {
//       console.timeEnd(`index: ${index}`)
//       if (item < 100) {
//         randomArr.push(100)
//       }
//       res(index)
//     }, item)
//   })
// }, 3).then(console.log)


module.exports = async function asyncLimit(arr, map, limit) {
  // 任务队列
  let taskArr = []
  let result = []
  // 开始arr[arrIndex]任务,结束时返回任务队列下标
  async function mapExtend (arrIndex, taskIndex) {
    result[arrIndex] = await map(arr[arrIndex], arrIndex)
    return taskIndex
  }

  for (let i = 0; i < arr.length; i++) {
    if (taskArr.length < limit) {
      taskArr.push(mapExtend(i, i))
    } else {
      let index = await Promise.race(taskArr)
      taskArr[index] = mapExtend(i, index)
    }
  }
  await Promise.all(taskArr)

  return result
}