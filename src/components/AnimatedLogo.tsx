import { Loader2 } from "lucide-react";

const AnimatedLogo: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <div className="flex items-center justify-center h-screen">
    <Loader2
      className="animate-spin"
      style={{ width: size, height: size, color: "#6B7280" }}
    />
  </div>
);

export default AnimatedLogo;
