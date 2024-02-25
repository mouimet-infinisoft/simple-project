import Image from 'next/image';
import logo from './logo.png'; // Make sure the path to your logo is correct

const Logo = ({width=32,height=32}:{width?:number,height?:number}) => (
  <Image src={logo} alt="Logo" width={width} height={height} /> // Adjust width and height as needed
);

export default Logo;
