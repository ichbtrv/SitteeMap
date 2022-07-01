import { largeMarker } from "../constants/options";
import { smallMarker } from './../constants/options';

/* eslint-disable @next/next/no-img-element */
interface Props {
  loading: boolean;
  className?: string;
  variant?: 'small';
}

const Sittee: React.FC<
  JSX.IntrinsicElements["div"] & Props> = ({ loading, variant, className }) => {
    return (
      <div className={`${variant ? 'text-2xl' : 'text-4xl'} ${className} rounded-md shadow-sm font-bold flex items-center px-2 py-1 hover:bg-gray-300 hover:bg-opacity-70 cursor-pointer appear`}>
        <img src={variant ? smallMarker : largeMarker} alt="logo" className={`${variant ? 'w-8' : 'w-14'} mr - 1 mb - 0.5  ${loading && 'animate-spin'} `} />
        <p className="mr-1">sittee</p>
      </div>
    );
  };

export default Sittee;
