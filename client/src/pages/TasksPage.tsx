import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import AirdropFrame from '../components/frame';
import logo from '../assets/Logo.svg';
import ButtonCreateWallet from '../components/buttons/ButtonCreateWallet';
import TaskCard from '../components/taskcard';
import TelegramIconTasks from '../components/socialMediaIcons/TelegramIconTasks';
import XIconTasks from '../components/socialMediaIcons/XIconTasks';
import { getTelegramUserId } from '../utils/getTelegramUser';

type Task = {
  name: string;
  title: string;
  reward: number;
  completed?: boolean;
};


const TasksPage = () => {
  const telegramId = getTelegramUserId();
  const [tasks, setTasks] = useState<Task[]>([]);


  const fetchTasks = async () => {
    if (!telegramId) return;
    try {
      const res = await fetch(`/api/tasks/${telegramId}`);
      const data = await res.json();
      if (data.success) setTasks(data.tasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [telegramId]);

  return (
    <PageLayout>
      {/* Header */}
      <section className="pt-[calc(env(safe-area-inset-top)+92px)] pb-4 px-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="ChopCoin Logo"
            className="w-[122px] h-[49px] object-contain"
          />
        </div>
        <ButtonCreateWallet className="w-[127px] h-[46px]" />
      </section>

      <div className="px-4 pt-safe-top pb-safe-bottom space-y-6">
        <AirdropFrame />
        <h2 className="text-2xl font-bold mb-4">📋 Your Tasks</h2>
      </div>

      <div className="pt-[calc(env(safe-area-inset-top)+92px)] px-3 pb-20">
        {tasks.map((task) => (
          <TaskCard
            key={task.name}
            icon={task.name === 'subscribe-channel' ? <TelegramIconTasks /> : <XIconTasks />}
            title={task.title}
            reward={`${task.reward * 100} CHOP`}
            taskName={task.name}
            telegramId={telegramId || ''}
            onSuccess={fetchTasks}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default TasksPage;
