import Image from 'next/image';
import logo from './logo.png'; // Make sure the path to your logo is correct

const Logo = () => (
  <Image src={logo} alt="Logo" width={32} height={32} /> // Adjust width and height as needed
);

export default Logo;
