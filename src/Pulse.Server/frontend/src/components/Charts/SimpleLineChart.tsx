import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export const SimpleLineChart: React.FC<{ data: any }> = ({ data }) => {
    console.log(data?.data);

    return (
        <div className='w-full h-72'>
            <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                    width={500}
                    height={300}
                    data={data?.data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='timestamp' onLoadedData={(d) => console.log(d)} />
                    <YAxis dataKey='fps' />
                    <Tooltip />
                    <Legend />
                    <Line type='step' dataKey='fps' stroke='#8884d8' activeDot={{ r: 8 }} />
                    <Line
                        hide
                        type='step'
                        dataKey='system_used_memory'
                        data={data?.data}
                        stroke='#82ca9d'
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
