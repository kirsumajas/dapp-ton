import SubscribeTask from '../components/SubscribeTask';
import PageLayout from '../components/PageLayout';

const TasksPage = () => {
  return (
    <PageLayout>
      <div className="px-4 pt-safe-top pb-safe-bottom space-y-6">
        <h1 className="text-2xl font-bold mb-4">📋 Your Tasks</h1>
        <SubscribeTask />
        {/* Future tasks */}
        {/* <FollowTwitterTask /> */}
      </div>
    </PageLayout>
  );
};

export default TasksPage;


