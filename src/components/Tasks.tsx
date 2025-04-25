export default function Tasks() {
    const taskList = [
      { title: "Follow on X", done: false },
      { title: "Join Telegram", done: false },
      { title: "Retweet & Tag", done: false },
    ];
  
    return (
      <ul className="space-y-2">
        {taskList.map((task, i) => (
          <li key={i} className="flex items-center gap-3">
            <input type="checkbox" disabled checked={task.done} />
            <span>{task.title}</span>
          </li>
        ))}
      </ul>
    );
  }
  