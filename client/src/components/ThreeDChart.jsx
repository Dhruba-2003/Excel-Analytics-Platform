import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

const Bar = ({ position, size, color, value }) => {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={[0, size[1] / 2 + 0.5, 0]} fontSize={0.4} color="black" anchorX="center" anchorY="middle">
        {value}
      </Text>
    </group>
  );
};

const ThreeDChart = ({ chartData, xAxisLabel, yAxisLabel }) => {
  const maxValue = Math.max(...chartData.map(item => item[yAxisLabel]));

  return (
    <Canvas camera={{ position: [5, 5, 15], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {chartData.map((item, index) => {
        const value = item[yAxisLabel];
        const barHeight = (value / maxValue) * 10 || 0;
        
        return (
          <Bar
            key={index}
            position={[index * 2 - chartData.length, barHeight / 2, 0]}
            size={[1, barHeight, 1]}
            color={'#2563EB'}
            value={value}
          />
        );
      })}

      {chartData.map((item, index) => (
         <Text key={index} position={[index * 2 - chartData.length, -1, 0]} fontSize={0.4} color="black" anchorX="center">
            {item[xAxisLabel]}
         </Text>
      ))}

      <OrbitControls />
    </Canvas>
  );
};
export default ThreeDChart;