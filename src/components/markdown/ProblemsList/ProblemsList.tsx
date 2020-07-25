import * as React from 'react';
import { Problem } from '../../../../content/models';
import Transition from '../../Transition';
import Tooltip from '../../Tooltip/Tooltip';
import TextTooltip from '../../Tooltip/TextTooltip';
import { sourceTooltip } from '../ResourcesList';
import ProblemStatusCheckbox from './ProblemStatusCheckbox';
// @ts-ignore
import id_to_sol from './id_to_sol.json';

type ProblemsListProps = {
  title?: string;
  children?: React.ReactChildren;
  problems: Problem[];
};

export function ProblemsList(props: ProblemsListProps) {
  const [problem, setProblem] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  return (
    <div className="-mx-4 sm:-mx-6 lg:mx-0">
      <div className="flex flex-col">
        <div className="-my-2 py-2 overflow-x-auto lg:-mx-4 lg:px-4">
          <div className="align-middle inline-block shadow overflow-hidden min-w-full lg:rounded-lg border-b border-gray-200">
            <table className="w-full no-markdown">
              <thead>
                <tr>
                  <th className="pl-4 md:pl-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="pl-4 md:px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="pl-4 sm:pl-10 md:pl-12 md:pr-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-no-wrap">
                    Problem Name
                  </th>
                  <th className="pl-4 md:px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="pl-4 md:pl-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider text-right">
                    Tags
                  </th>
                  <th className="pl-4 pr-4 md:px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider text-right">
                    Solution
                  </th>
                </tr>
              </thead>
              <tbody className="table-alternating-stripes">
                {props.problems.map(problem => (
                  <ProblemComponent
                    problem={problem}
                    onShowSolution={problem => {
                      setProblem(problem);
                      setShowModal(true);
                    }}
                    key={problem.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Transition show={showModal} timeout={300}>
        <div className="fixed z-10 bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center">
          <Transition
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity">
              <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={() => setShowModal(false)}
              />
            </div>
          </Transition>

          <Transition
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className="relative bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-xl sm:w-full sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    Solution Sketch: {problem?.name}
                  </h3>
                  <div className="mt-4">
                    <p className="text-gray-700">{problem?.sketch}</p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>
  );
}

type ProblemComponentProps = {
  problem: Problem;
  onShowSolution: Function;
};

export function ProblemComponent(props: ProblemComponentProps) {
  const difficultyClasses = {
    'Very Easy': 'bg-gray-100 text-gray-800',
    Easy: 'bg-green-100 text-green-800',
    Normal: 'bg-blue-100 text-blue-800',
    Hard: 'bg-purple-100 text-purple-800',
    'Very Hard': 'bg-orange-100 text-orange-800',
    Insane: 'bg-red-100 text-red-800',
  };
  const [showTags, setShowTags] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  const { problem } = props;
  const id = `problem-${problem.uniqueID}`;
  React.useEffect(() => {
    setIsActive(window && window.location && window.location.hash === '#' + id);
  }, []);
  const isUsaco = source => {
    const posi = ['Bronze', 'Silver', 'Gold', 'Plat'];
    for (let ind = 0; ind < posi.length; ++ind) {
      if (source.includes(posi[ind])) return true;
    }
    return false;
  };
  const isExternal = link => {
    return link.startsWith('http');
  };
  const isInternal = link => {
    return /^[a-zA-Z\-0-9]+$/.test(link);
  };
  let msg = false;
  let internal = false;
  let external = false;
  let sol = problem.solution ? problem.solution : '';
  if (sol.length > 0 && isInternal(sol)) {
    internal = true;
    sol = '/solutions/' + sol;
  } else {
    if (sol == '' && isUsaco(problem.source) && problem.id in id_to_sol) {
      sol = `http://www.usaco.org/current/data/` + id_to_sol[problem.id];
    }
    if (
      sol == '' &&
      problem.source == 'CF' &&
      problem.id.startsWith('contest/')
    ) {
      sol = '@Check CF';
    }
    if (isExternal(sol)) {
      external = true;
    } else if (sol.startsWith('@')) {
      msg = true;
      sol = sol.substring(1);
    } else {
      if (sol.length != 0) {
        throw new Error('Unrecognied solution - ' + sol);
      }
    }
  }
  return (
    <tr id={id} style={isActive ? { backgroundColor: '#FDFDEA' } : null}>
      <td className="pl-4 md:pl-6 whitespace-no-wrap text-sm text-gray-500 font-medium">
        <div
          style={{ height: '1.25rem' }}
          className="flex items-center justify-center"
        >
          <ProblemStatusCheckbox problem={problem} />
        </div>
      </td>
      <td className="pl-4 md:px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500 font-medium">
        {sourceTooltip.hasOwnProperty(problem.source) ? (
          <TextTooltip content={sourceTooltip[problem.source]}>
            {problem.source}
          </TextTooltip>
        ) : (
          problem.source
        )}
      </td>
      <td className="pl-4 md:px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium">
        <div className="flex items-center">
          {problem.starred && (
            <Tooltip content="We highly recommend you do all starred problems!">
              <svg
                className="h-4 w-4 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </Tooltip>
          )}
          <a
            href={problem.url}
            className={problem.starred ? 'pl-1 sm:pl-2' : 'sm:pl-6'}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            {problem.name}
          </a>
          {problem.isIntro && (
            <span
              className={
                'ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800'
              }
            >
              Intro
            </span>
          )}
        </div>
      </td>
      <td className="pl-4 md:px-6 py-4 whitespace-no-wrap leading-5 w-full">
        {problem.difficulty && (
          <span
            className={
              'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ' +
              difficultyClasses[problem.difficulty]
            }
          >
            {problem.difficulty}
          </span>
        )}
      </td>
      <td className="pl-4 md:pl-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
        {!showTags && (
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-900"
            onClick={e => {
              e.preventDefault();
              setShowTags(true);
            }}
          >
            Show Tags
          </a>
        )}
        {showTags &&
          (problem.tags && problem.tags.length
            ? problem.tags.join(', ')
            : 'None')}
      </td>
      <td className="pl-4 pr-4 md:px-6 py-4 whitespace-no-wrap text-right text-sm font-medium leading-none">
        {/* {sol} */}
        {/* {/^[a-zA-Z\-0-9]+$/.test(problem.sketch) && "OK"} */}
        {/* {!/^[a-zA-Z\-0-9]+$/.test(problem.sketch) && "NOT OK"} */}
        {/* {problem.id} */}
        {msg && sol}
        {external && (
          <a
            href={sol}
            target="_blank"
            className={problem.starred ? 'pl-1 sm:pl-2' : 'sm:pl-6'}
          >
            External Sol
          </a>
        )}
        {internal && (
          <div
            className={
              'inline-flex items-center h-5 group ' +
              (problem.starred ? 'pl-1 sm:pl-2' : 'sm:pl-6')
            }
          >
            {problem.solQuality === 'good' && (
              <Tooltip content="This solution is verified to be complete and of high quality.">
                <svg
                  className="h-5 w-5 text-green-400 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Tooltip>
            )}
            {problem.solQuality === 'bad' && (
              <Tooltip content="This solution is still a work-in-progress. It may be vague or incomplete.">
                <svg
                  className="h-5 w-5 text-gray-300 group-hover:text-yellow-300 mr-1 transition ease-in-out duration-150"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </Tooltip>
            )}
            <a href={sol} target="_blank">
              Internal Sol
            </a>
          </div>
        )}
        {!msg && !external && !internal && problem.sketch && (
          <span
            className="text-blue-600 hover:text-blue-900 cursor-pointer inline-flex items-center group h-5"
            onClick={() => problem.sketch && props.onShowSolution(problem)}
          >
            <Tooltip content="This solution is still a work-in-progress. It may be vague or incomplete.">
              <svg
                className="h-5 w-5 text-gray-300 mr-1 group-hover:text-yellow-300 transition duration-150 ease-in-out"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </Tooltip>
            Show Sketch
          </span>
        )}
        {!msg && !external && !internal && !problem.sketch && (
          <Tooltip
            content={`We haven't written a solution for this problem yet. If needed, request one using the "Contact Us" button!`}
          >
            <span className="text-gray-300">View Solution</span>
          </Tooltip>
        )}
      </td>
    </tr>
  );
}
