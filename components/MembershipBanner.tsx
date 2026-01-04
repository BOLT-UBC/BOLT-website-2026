"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";

interface MembershipBannerProps {
  variant?: 'overlay' | 'inline'
}

const MembershipBanner: React.FC<MembershipBannerProps> = ({ variant = 'overlay' }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/membership');
  };

  const content = (
    <div className="bg-black/20 backdrop-blur-lg rounded-lg p-4 lg:p-5 border border-white/20 shadow-lg">
      <div className="flex flex-col gap-3">
        <h2 className="font-inter text-base lg:text-lg xl:text-xl font-bold text-white leading-tight">
          Check out the new membership portal
        </h2>
        <p className="font-inter text-xs lg:text-sm leading-relaxed text-white/90">
          BOLT members get access to exclusive resources and perks like interview prep breakdowns and more.
        </p>
        <div className="pt-1 flex justify-center">
          <Button
            text="Portal"
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );

  if (variant === 'inline') {
    return (
      <div id="Membership-inline" className="w-full max-w-md mt-6 z-40">
        {content}
      </div>
    );
  }

  return (
    <div id="Membership" className="hidden md:block absolute top-1/2 -translate-y-1/2 right-6 lg:right-16 z-40 max-w-sm lg:max-w-md">
      {content}
    </div>
  );
};

export default MembershipBanner;

