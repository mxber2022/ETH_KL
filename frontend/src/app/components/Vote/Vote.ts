import { useWriteContract } from 'wagmi';
import { abi } from '../../../abi';
import myconfig from '../../myconfig.json';
import { Address, parseEther } from 'viem';

export const Vote = async (projectname: string, amount: string) => {
    const { writeContract } = useWriteContract();
    
    try {
        await writeContract({
            abi,
            address: myconfig.CONTRACT_ADDRESS_SEPOLIA as Address,
            functionName: 'vote',
            args: [
                projectname
            ],
            value: parseEther(amount)
        });
        console.log('Vote placed successfully');
    } catch (err) {
        console.error('Error placing vote:', err);
    }
};