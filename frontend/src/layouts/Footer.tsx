import KPVLogo from "@/assets/images/KPV_Taxi_logo_text.png";

export const Footer = () => {
  return (
    <footer className="flex flex-col items-center text-center text-xs text-cyan-950 text-muted-foreground py-4">
      <img src={KPVLogo} alt="KPV Taxi Logo" className="w-[30%]" />
      <p>
        {" "}
        ©2025 All Rights Reserved.{" "}
        <span className="font-medium">KPV Taxi Administration</span> Powered by
        KPV.{" "}
        <a href="#" className="underline hover:text-primary">
          Privacy
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-primary">
          Terms
        </a>
      </p>
    </footer>
  );
};
