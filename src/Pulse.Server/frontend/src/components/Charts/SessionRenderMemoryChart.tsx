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
import { HeadingSecondary } from '../Typography/HeadingSecondary';
import { SessionDetailData } from '../../types/session';

export const SessionRenderMemoryChart: React.FC<{ data: any }> = ({ data }) => {
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
            <HeadingSecondary textCenter>Render Memory</HeadingSecondary>

            <ResponsiveContainer width='100%' height='100%' minHeight={300}>
                <LineChart
                    data={data?.data.map((d: SessionDetailData) => ({
                        ...d,
                        render_textures_bytes: d.render_textures_bytes,
                        used_buffers_bytes: d.used_buffers_bytes,
                        vertex_buffer_upload_in_frame_bytes: d.vertex_buffer_upload_in_frame_bytes,
                        profiler_used_memory: d.profiler_used_memory,
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
                        tickFormatter={(value) => formatMemory(value)}
                        tick={{ fill: '#666', fontSize: 12 }}
                        domain={[0, 'dataMax + 10']}
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
                                case 'render_textures_bytes':
                                    return [`${formattedValue}`, 'Render Textures Memory'];
                                case 'used_buffers_bytes':
                                    return [`${formattedValue}`, 'Used Buffers Memory'];
                                case 'vertex_buffer_upload_in_frame_bytes':
                                    return [`${formattedValue}`, 'Vertex Buffer Upload in Frame Memory'];
                                case 'profiler_used_memory':
                                    return [`${formattedValue}`, 'Profiler Used Memory'];
                                default:
                                    return [`${formattedValue}`, name];
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

                    {/* Line for Render Textures Memory */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='render_textures_bytes'
                        stroke='#8884d8'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />

                    {/* Line for Used Buffers Memory */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='used_buffers_bytes'
                        stroke='#82ca9d'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />

                    {/* Line for Vertex Buffer Upload in Frame Memory */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='vertex_buffer_upload_in_frame_bytes'
                        stroke='#f8b500'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />

                    {/* Line for Profiler Used Memory */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='profiler_used_memory'
                        stroke='#ff7300'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
