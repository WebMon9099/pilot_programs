import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appendClass } from '../../../lib';
import { ActivityObject } from '../../../types';
import { PushButton } from '../../core';

interface ActivityQueryResolverProps
  extends React.HTMLAttributes<HTMLDivElement> {
  activityObject: ActivityObject;
  trainingMode: boolean;
}

const ActivityQueryResolver: React.FC<ActivityQueryResolverProps> = ({
  activityObject,
  trainingMode,
  ...rest
}) => {
  const [selectedQueries, setSelectedQueries] = useState<{
    [key: string]: string;
  }>({});

  const navigate = useNavigate();

  useEffect(() => {
    if (
      !activityObject.queries ||
      Object.keys(activityObject.queries).length === 0
    ) {
      navigate(`/${activityObject.path}/run`, {
        state: { trainingMode },
      });
    }
  }, [navigate, activityObject.path, activityObject.queries, trainingMode]);

  const currentQuery =
    activityObject.queries &&
    Object.entries(activityObject.queries)[Object.keys(selectedQueries).length];

  if (currentQuery) {
    const [key, query] = currentQuery;

    return (
      <div
        {...rest}
        className={appendClass('activity-type-selector', rest.className)}
      >
        {/* <h1>Select a {query.name}:</h1> */}
        <h1>Select an Exam Type:</h1>
        {query.options.map((option) => (
          <PushButton
            className="mb-[2vh] h-[10vh] w-full rounded-md border border-[#dfdfdf] bg-white px-6 py-4 text-center font-semibold text-[#404040] transition hover:scale-105 hover:border-theme-blue hover:opacity-100 hover:shadow-md active:scale-95 active:brightness-95 md:opacity-80"
            onClick={() => {
              const newSelectedQueries = { ...selectedQueries, [key]: option };

              if (
                Object.keys(newSelectedQueries).length ===
                Object.keys(activityObject.queries!).length
              ) {
                const finalQuery = Object.entries(newSelectedQueries).reduce(
                  (str, [key, value], i) =>
                    `${str}${i !== 0 ? '&' : ''}${key}=${value}`,
                  ''
                );

                navigate(`/${activityObject.path}/run?${finalQuery}`, {
                  state: { trainingMode },
                });
              }

              setSelectedQueries(newSelectedQueries);
            }}
            key={option}
          >
            {option}
          </PushButton>
        ))}
      </div>
    );
  }

  return null;
};

export default ActivityQueryResolver;
