// 各入力フォーム、ボタン等の要素を取得
const content = document.getElementById("content")
const date = document.getElementById("date")
const time = document.getElementById("time")
const button = document.getElementById("button")
const taskSpace = document.getElementById("task-space")

// task格納用
let tasks = []

// currentTimeの方が大きければ期日を過ぎたことになる
const currentTime = new Date().getTime()

// taskの表示
const displayTasks = () => {
  let htmlTags = ""
  tasks.map((t, index) => {
    // もし期日を過ぎていたらoverクラスを付けてスタイルに取り消し線を追加する
    htmlTags += `
      <p class=${currentTime >= t.timelimit ? "over" : ""}>${index + 1}: ${t.content}, ${new Date(t.timelimit)}</p>
    `
  })
  taskSpace.innerHTML = htmlTags
}
// taskの消去
document.getElementById("all-clear").addEventListener("click", function() {
  tasks = []; // タスク配列を空にする
  localStorage.removeItem("local-tasks"); // ローカルストレージからタスクを削除
  displayTasks(); // タスク表示を更新
});



// localStorageに存在するかどうかの確認
// 存在すればそのままtasksに格納
const localTasks = localStorage.getItem("local-tasks")

if (!localTasks) {
  // ローカルストレージにtaskが無い時
  console.log("none")
} else {
  // ローカルストレージにタスクがある時
  // ローカルストレージから取り出すときはJSON.parse()
  tasks = JSON.parse(localTasks)
  displayTasks()
}
// unix時間を導き出すための関数
// 入力された日付・時間を結合して数値の配列に変え、返り値にする
const createDatetimeArray = (date, time) => {
    const datetimearr = []
    // dateをハイフン(-)で年・月・時に分割
    const datearr = date.split("-")
    // timeをコロン(:)で時・分に分割
    const timearr = time.split(":")
    // 二つの配列を結合したのち数値に変換→空の配列に格納
    const tmparr = datearr.concat(timearr)
    tmparr.map(t => {
      datetimearr.push(Number(t))
    })
    // 返した配列でunix時間へ変換
    return datetimearr
  }
  // task追加の関数
const addTask = () => {
    // 入力フォームの存在性チェック
    if (!content.value || !date.value || !time.value) {
      alert("全項目を入力してください")
    } else {
      const timearr = createDatetimeArray(date.value, time.value)
      // taskに格納する際、unix時間にする
      // new Dateに日時を指定する際、月だけ1少ない数じゃないと翌月になる
      const limitdate = new Date(timearr[0], timearr[1]-1, timearr[2], timearr[3], timearr[4])
      // ローカルへ保存前にtasksに格納する
      tasks.push({content: content.value, timelimit: limitdate.getTime()})
      // ローカルストレージに格納するときはJSON.stringify()
      localStorage.setItem("local-tasks", JSON.stringify(tasks))
      displayTasks()
    }
  }
  
  // フォームに入力してボタンを押したらtasksに追加
  button.addEventListener("click", addTask);