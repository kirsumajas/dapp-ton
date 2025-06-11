import SubscribeTask from '../components/SubscribeTask';
import PageLayout from '../components/PageLayout';
import AirdropFrame from '../components/frame';
import logo from '../assets/Logo.svg';
import ButtonCreateWallet from '../components/buttons/ButtonCreateWallet';
import TaskCard from '../components/taskcard';
import TelegramIconTasks from '../components/socialMediaIcons/TelegramIconTasks';
import XIconTasks from '../components/socialMediaIcons/XIconTasks';

const TasksPage = () => {
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
         <SubscribeTask />
      </div>

      <div className="pt-[calc(env(safe-area-inset-top)+92px)] px-3 pb-20">
      <TaskCard
        icon={<TelegramIconTasks />}
        title="Join Telegram channel"
        reward="100 CHOP"
        onStart={() => console.log('Start Telegram task')}
      />
      <TaskCard
        icon={<XIconTasks />}
        title="Subscribe to X"
        reward="100 CHOP"
        onStart={() => console.log('Start X task')}
      />
    </div>
    </PageLayout>
  );
};

export default TasksPage;


