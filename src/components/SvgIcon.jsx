import { lazy, Suspense } from "react";

const SvgIcon = ({ name, className }) => {
  const IconComponent = lazy(() => import(`@/assets/${name}.svg`));
  return (
    <Suspense>
      <IconComponent className={className} />
    </Suspense>
  );
};

export default SvgIcon;
