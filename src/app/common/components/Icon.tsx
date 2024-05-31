"use client";

import { Icon as IconBaseComponent, loadIcon } from "@iconify/react";
import { Skeleton } from "@/components/ui/skeleton";
import { ComponentPropsWithoutRef, memo, useEffect, useState } from "react";

const Icon = ({
  width = 16,
  height = 16,
  icon,
  className,
}: ComponentPropsWithoutRef<typeof IconBaseComponent>) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadIcon(icon as string).then(() => {
      setIsLoaded(true);
    });
  }, [icon]);

  if (!isLoaded) {
    return <Skeleton style={{ width, height }} />;
  }

  return (
    <IconBaseComponent
      width={width}
      height={height}
      icon={icon}
      className={className}
      style={{ width, height, display: "block" }}
    />
  );
};

export default memo(Icon);
