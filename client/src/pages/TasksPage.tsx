import SubscribeTask from '../components/SubscribeTask';

const TasksPage = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">📋 Your Tasks</h1>
      <SubscribeTask />
      {/* Future tasks */}
      {/* <FollowTwitterTask /> */}
    </div>
  );
};

export default TasksPage;


