import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const DebugChart = () => {
  const data = [
    { name: 'Page A', uv: 400 },
    { name: 'Page B', uv: 300 },
    { name: 'Page C', uv: 200 },
  ];

  return (
    <BarChart width={400} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="uv" fill="#8884d8" />
    </BarChart>
  );
};

export default DebugChart;
