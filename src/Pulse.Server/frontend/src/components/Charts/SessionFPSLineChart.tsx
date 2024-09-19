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
import { SessionDetailData } from '../../types/session';
import { HeadingSecondary } from '../Typography/HeadingSecondary';

export const SessionFPSLineChart: React.FC<{ data: any }> = ({ data }) => {
    const formatTimestamp = (timestampInSeconds: number) => {
        const timestampInMilliseconds =
            timestampInSeconds >= 1_000_000_000 ? timestampInSeconds * 1000 : timestampInSeconds;

        return new Date(timestampInMilliseconds).toUTCString();
    };

    const formatMemory = (bytes: number) => {
        let kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        let mb = kb / 1024;
        if (mb < 1024) return `${mb.toFixed(1)} MB`;
        let gb = mb / 1024;
        return `${gb.toFixed(1)} GB`;
    };

    if (!data?.data) {
        return <div />;
    }

    return (
        <div className='h-auto border p-4 rounded-lg shadow-sm my-6'>
            <HeadingSecondary textCenter>FPS and Memory Usage Over Time (UTC)</HeadingSecondary>

            <ResponsiveContainer width='100%' height='100%' minHeight={300}>
                <LineChart
                    data={data?.data.map((d: SessionDetailData) => ({
                        ...d,
                        system_used_memory: d.system_used_memory,
                        total_used_memory: d.total_used_memory,
                        gc_used_memory: d.gc_used_memory,
                        fps: d.fps,
                    }))}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 30,
                    }}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
                    <XAxis
                        dataKey={(d) => formatTimestamp(d.timestamp)}
                        tick={{ fill: '#666', fontSize: 12 }}
                        tickFormatter={(tick) =>
                            new Date(tick).toLocaleTimeString('en-US', { timeZone: 'UTC' })
                        }
                        label={{
                            value: 'Time (UTC)',
                            position: 'insideBottom',
                            offset: -8,
                            fill: '#666',
                            fontSize: 14,
                        }}
                    />
                    <YAxis
                        yAxisId='left'
                        dataKey='fps'
                        tick={{ fill: '#666', fontSize: 12 }}
                        domain={[0, 'dataMax + 10']}
                        label={{
                            value: 'FPS',
                            angle: -90,
                            position: 'insideLeft',
                            fill: '#666',
                            fontSize: 14,
                        }}
                    />
                    <YAxis
                        yAxisId='right'
                        orientation='right'
                        tickFormatter={(value) => formatMemory(value)}
                        tick={{ fill: '#666', fontSize: 12 }}
                        label={{
                            value: 'Memory (KB, MB, GB)',
                            angle: 90,
                            position: 'insideRight',
                            fill: '#666',
                            fontSize: 14,
                            dx: 20,
                            dy: 70,
                        }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #d9d9d9',
                            borderRadius: 10,
                            fontSize: 12,
                            color: '#333',
                        }}
                        labelStyle={{
                            color: '#333',
                            fontWeight: 'bold',
                            borderBottom: '1px solid #d9d9d9',
                            paddingBottom: 5,
                        }}
                        labelFormatter={(label) =>
                            `Time: ${new Date(label).toLocaleString('en-US', { timeZone: 'UTC' })}`
                        }
                        formatter={(value, name) => {
                            let formattedValue = formatMemory(Number(value));

                            switch (name) {
                                case 'fps':
                                    return [value, 'FPS'];
                                case 'total_used_memory':
                                    return [`${formattedValue}`, 'Total Used Memory'];
                                case 'system_used_memory':
                                    return [`${formattedValue}`, 'System Used Memory'];
                                default:
                                    return [`${formattedValue}`, 'GC Used Memory'];
                            }
                        }}
                    />

                    {/* Legend */}
                    <Legend
                        layout='horizontal'
                        verticalAlign='bottom'
                        align='center'
                        iconType='plainline'
                        wrapperStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #eee',
                            borderRadius: '5px',
                            padding: '4px 16px',
                            fontSize: 12,
                            color: '#333',
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            width: 'auto',
                            transform: 'translateX(-50%)',
                        }}
                    />

                    {/* Line for FPS */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='fps'
                        stroke='#82ca9d'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />

                    {/* Line for System Used Memory */}
                    <Line
                        yAxisId='right'
                        type='monotone'
                        dataKey='system_used_memory'
                        stroke='#8884d8'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />

                    {/* Line for Total Used Memory */}
                    <Line
                        yAxisId='right'
                        type='monotone'
                        dataKey='total_used_memory'
                        stroke='#f8b500'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />

                    {/* Line for GC Used Memory */}
                    <Line
                        yAxisId='right'
                        type='monotone'
                        dataKey='gc_used_memory'
                        stroke='#ff7300'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
