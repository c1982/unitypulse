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

export const SessionRenderCountChart: React.FC<{ data: any }> = ({ data }) => {
    const formatTimestamp = (timestampInSeconds: number) => {
        const timestampInMilliseconds =
            timestampInSeconds >= 1_000_000_000 ? timestampInSeconds * 1000 : timestampInSeconds;

        return new Date(timestampInMilliseconds).toUTCString();
    };

    if (!data?.data) {
        return <div />;
    }

    return (
        <div className='h-auto border p-4 rounded-lg shadow-sm my-6'>
            <HeadingSecondary textCenter>Render Counts</HeadingSecondary>

            <ResponsiveContainer width='100%' height='100%' minHeight={300}>
                <LineChart
                    data={data?.data}
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

                    {/* Line for Set Pass Calls Count */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='set_pass_calls_count'
                        stroke='#8884d8'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />

                    {/* Line for Draw Calls Count */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='draw_calls_count'
                        stroke='#82ca9d'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />

                    {/* Line for Total Batches Count */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='total_batches_count'
                        stroke='#f8b500'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />

                    {/* Line for Triangles Count */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='triangles_count'
                        stroke='#ff7300'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />

                    {/* Line for Vertices Count */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='vertices_count'
                        stroke='#00C49F'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />

                    {/* Line for Render Textures Count */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='render_textures_count'
                        stroke='#FFBB28'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />

                    {/* Line for Render Textures Changes Count */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='render_textures_changes_count'
                        stroke='#0088FE'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />

                    {/* Line for Used Buffers Count */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='used_buffers_count'
                        stroke='#FF8042'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />


                    {/* Line for Used Shaders Count */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='used_shaders_count'
                        stroke='#A28DFF'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />


                    {/* Line for Vertex Buffer Upload in Frame Count */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='vertex_buffer_upload_in_frame_count'
                        stroke='#FF6384'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />


                    {/* Line for Index Buffer Upload in Frame Count */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='index_buffer_upload_in_frame_count'
                        stroke='#36A2EB'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />


                    {/* Line for Shadow Casters Count */}
                    <Line
                        yAxisId='left'
                        type='monotone'
                        dataKey='shadow_casters_count'
                        stroke='#FF9F40'
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
