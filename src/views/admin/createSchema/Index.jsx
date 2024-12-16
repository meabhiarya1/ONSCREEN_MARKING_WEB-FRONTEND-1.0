import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { VscChromeClose } from "react-icons/vsc";

const Index = () => {
  const [subjects, setSubjects] = useState(null);
  const [questions, setQuestions] = useState({
    primaryQuestion: [],
    secondaryQuestion: [],
    primaryQuestionMaxMark: null,
    secondaryQuestionMark: null,
    questionTobeAnswered: null,
    bonusMark: null,
    isCompulsory: false,
  });

  const [allQuestions, setAllQuestions] = useState([]);
  const handleClick = () => {
    setAllQuestions([
      ...allQuestions,
      {
        primaryQuestion: questions.primaryQuestion,
        secondaryQuestion: questions.secondaryQuestion,
        primaryQuestionMaxMark: questions.primaryQuestionMaxMark,
        secondaryQuestionMark: questions.secondaryQuestionMark,
        questionTobeAnswered: questions.questionTobeAnswered,
        bonusMark: questions.bonusMark,
        isCompulsory: questions.isCompulsory,
      },
    ]);
  };

  const handleCrossClick = (index) => {
    setAllQuestions(allQuestions.filter((_, i) => i !== index));
  };

  const { id } = useParams();


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/subjects/getbyid/subject/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubjects(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <section className="mx-2 mt-6 h-[100%] rounded-lg bg-white">
      <div className="flex h-[calc(100%-24px)]">
        {/* Left side with image */}
        <div className="custom-scrollbar h-[100%] w-1/2 flex-shrink-0 overflow-y-auto">
          <img
            alt=""
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjnkLH9jkkK5zz4bocFOdxp7I3kebgsk52H3yVQo7j-FdDXO0VxsJL_NEgFaon6PtxuVnIl6kWVfcw7CUjasbLftbsgD2MNlLTvFGoO7MCeM2vpYyGsHxdoP3Fu_YF22Pi15HRz8C7SD9rU/s1600/questions.jpg"
          />
        </div>

        {/* Right side with content */}
        <div className="border-sky-500 mx-2 mt-8 w-1/2 rounded-md border p-4">
          <div className="border-sky-500 mb-4 rounded-md border p-2 text-center">
            <h4 className="text-lg font-bold text-gray-900 ">
              {subjects?.name} ({subjects?.code})
            </h4>
          </div>

          {/* Extra space for any additional content */}

          <div className="border-sky-500 flex gap-2 rounded-md border p-2">
            <div className="border-sky-500 relative w-1/3 rounded-md border p-2">
              <h3 className="text-left text-lg font-bold text-gray-700">
                Type number of Questions
              </h3>
              <input
                type="text"
                id="questionNumber"
                placeholder="Enter total number of questions"
                className="mt-2 w-full rounded-md border-gray-200 p-2 pe-10 shadow-sm sm:text-sm"
              />
            </div>

            <div className="relative flex w-1/3 gap-2">
              <div className="border-sky-500 flex w-1/2 flex-col items-center rounded-md border p-2">
                <h3 className="text-lg font-bold text-gray-700">Max Marks</h3>
                <p className="mt-2 text-lg">100 </p>
              </div>
              <div className="border-sky-500 flex w-1/2 flex-col items-center rounded-md border p-2">
                <h3 className="text-lg font-bold text-gray-700">Min Marks</h3>
                <p className="mt-2 text-lg">33 </p>
              </div>
            </div>

            <div className="border-sky-500 w-1/3 rounded-md border py-2 text-center">
              <h3 className="text-lg font-bold text-gray-700">
                Evaluation View
              </h3>
            </div>
          </div>

          <div className="border-sky-500 mt-2 flex w-full gap-2 rounded-lg border px-2">
            <div className="w-2/3 rounded-lg">
              {/* Primary Question Info */}
              <div className="border-sky-500 relative my-3 rounded-lg border">
                <h3 className="my-2 rounded-lg text-center text-lg font-bold text-gray-700">
                  Primary Question Information
                </h3>
                <div className="flex w-full">
                  <div className="mt-2 flex w-1/3 justify-evenly p-2 text-center">
                    <div className="border-sky-500 rounded-md">
                      <h3 className="text-sm">Ques No.</h3>
                      <input
                        type="text"
                        className="border-sky-500 mt-2 w-full rounded-md border p-2 pe-10 shadow-sm sm:text-sm"
                        onChange={(e) => {
                          setQuestions({
                            ...questions,
                            primaryQuestion: e.target.value,
                          });
                        }}
                        value={questions.primaryQuestion}
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex w-1/3 justify-evenly p-2 text-center">
                    <div>
                      <h3 className="text-sm">Max Mark</h3>
                      <input
                        type="text"
                        className="border-sky-500 mt-2 w-full rounded-md border p-2 pe-10 shadow-sm sm:text-sm"
                        onChange={(e) => {
                          setQuestions({
                            ...questions,
                            primaryQuestionMaxMark: e.target.value,
                          });
                        }}
                        value={questions.primaryQuestionMaxMark}
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex w-1/3 justify-evenly p-2 text-center">
                    <div>
                      <h3 className="text-sm">Ques to be Attend </h3>
                      <input
                        type="text"
                        className="border-sky-500 mt-2 w-full rounded-md border p-2 pe-10 shadow-sm sm:text-sm"
                        onChange={(e) => {
                          setQuestions({
                            ...questions,
                            questionTobeAnswered: e.target.value,
                          });
                        }}
                        value={questions.questionTobeAnswered}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Sub division Question Info */}
              <div className="border-sky-500 relative my-2 rounded-lg border">
                <h3 className="mt-2 text-center text-lg font-bold text-gray-700">
                  Primary Question Sub Division Information
                </h3>
                <div className="flex">
                  <div className="mt-2 flex w-1/4 justify-evenly p-2 text-center">
                    <div className="border-sky-500 rounded-md">
                      <h3 className="text-sm">Ques No.</h3>
                      <input
                        type="text"
                        className="border-sky-500 mt-2 w-full rounded-md border p-2 pe-10 shadow-sm sm:text-sm"
                        onChange={(e) => {
                          setQuestions({
                            ...questions,
                            secondaryQuestion: e.target.value,
                          });
                        }}
                        value={questions.secondaryQuestion}
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex w-1/4 justify-evenly p-2 text-center">
                    <div>
                      <h3 className="text-sm">Mark</h3>
                      <input
                        type="text"
                        className="border-sky-500 mt-2 w-full rounded-md border p-2 pe-10 shadow-sm sm:text-sm"
                        onChange={(e) => {
                          setQuestions({
                            ...questions,
                            secondaryQuestionMark: e.target.value,
                          });
                        }}
                        value={questions.secondaryQuestionMark}
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex w-1/4 justify-evenly p-2 text-center">
                    <div>
                      <h3 className="text-sm">Bonus Marks</h3>
                      <input
                        type="text"
                        className="border-sky-500 mt-2 w-full rounded-md border p-2 pe-10 shadow-sm sm:text-sm"
                        onChange={(e) => {
                          setQuestions({
                            ...questions,
                            bonusMark: e.target.value,
                          });
                        }}
                        value={questions.bonusMark}
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex w-1/4 justify-evenly p-2 text-center">
                    <div>
                      <h3 className="text-sm">Compulsory </h3>
                      <input
                        type="checkbox"
                        className="border-sky-400 mt-3 h-6 w-6 cursor-pointer rounded-md border shadow-sm"
                        onChange={(e) => {
                          setQuestions({
                            ...questions,
                            isCompulsory: e.target.checked,
                          });
                        }}
                        value={questions.isCompulsory}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Evaluation Parameters */}
              <div className="border-sky-500 relative my-2 rounded-lg border px-4 py-8 ">
                <div className="flex gap-8">
                  <div className="relative">
                    <details className="group [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer items-center gap-2 border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600">
                        <span className="text-center text-sm font-bold text-gray-700">
                          {" "}
                          Minimum Evaluation Time{" "}
                        </span>

                        <span className="transition group-open:-rotate-180">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        </span>
                      </summary>

                      <div className="z-50 group-open:absolute group-open:start-0 group-open:top-auto group-open:mt-2">
                        <div className="w-96 rounded border border-gray-200 bg-white">
                          <header className="flex items-center justify-between p-4">
                            <span className="text-sm text-gray-700">
                              Define Minimum Evaluation Time <br />
                            </span>
                          </header>

                          <ul className="border-sky-500 space-y-1 border-t p-4">
                            <li>
                              <label
                                htmlFor="FilterInStock"
                                className="inline-flex items-center gap-2"
                              >
                                <span className="text-sm font-medium text-gray-700">
                                  Time For Single Booklet:
                                </span>
                                <input
                                  type="text"
                                  id="FilterInStock"
                                  className="border-sky-500 mx-2 size-10 w-1/2 rounded border px-4"
                                  placeholder="minutes"
                                />
                              </label>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </details>
                  </div>

                  <div className="relative">
                    <details className="group [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer items-center gap-2  border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600">
                        <span className="text-center text-sm font-bold text-gray-700">
                          {" "}
                          Total Page Number{" "}
                        </span>

                        <span className="transition group-open:-rotate-180">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        </span>
                      </summary>

                      <div className="z-50 group-open:absolute group-open:start-0 group-open:top-auto group-open:mt-2">
                        <div className="w-96 rounded border border-gray-200 bg-white">
                          <div className="border-t border-gray-200 p-4">
                            <div className="flex justify-between gap-4">
                              <label
                                htmlFor="FilterPriceFrom"
                                className="flex items-center gap-2"
                              >
                                <span className="text-sm text-gray-600">$</span>

                                <input
                                  type="number"
                                  id="FilterPriceFrom"
                                  placeholder="From"
                                  className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                />
                              </label>

                              <label
                                htmlFor="FilterPriceTo"
                                className="flex items-center gap-2"
                              >
                                <span className="text-sm text-gray-600">$</span>

                                <input
                                  type="number"
                                  id="FilterPriceTo"
                                  placeholder="To"
                                  className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>

                  <div className="relative">
                    <details className="group [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer items-center gap-2  border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600">
                        <span className="text-center text-sm font-bold text-gray-700">
                          {" "}
                          Digital Print of Marks{" "}
                        </span>

                        <span className="transition group-open:-rotate-180">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        </span>
                      </summary>

                      <div className="z-50 group-open:absolute group-open:start-0 group-open:top-auto group-open:mt-2">
                        <div className="w-96 rounded border border-gray-200 bg-white">
                          <header className="flex items-center justify-between p-4">
                            <span className="text-sm text-gray-700"> </span>

                            <button
                              type="button"
                              className="text-sm text-gray-900 underline underline-offset-4"
                            >
                              Reset
                            </button>
                          </header>

                          <div className="border-t border-gray-200 p-4">
                            <div className="flex justify-between gap-4">
                              <label
                                htmlFor="FilterPriceFrom"
                                className="flex items-center gap-2"
                              >
                                <span className="text-sm text-gray-600">$</span>

                                <input
                                  type="number"
                                  id="FilterPriceFrom"
                                  placeholder="From"
                                  className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                />
                              </label>

                              <label
                                htmlFor="FilterPriceTo"
                                className="flex items-center gap-2"
                              >
                                <span className="text-sm text-gray-600">$</span>

                                <input
                                  type="number"
                                  id="FilterPriceTo"
                                  placeholder="To"
                                  className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
              {/* Base */}

              <div className="my-2 flex justify-end">
                <div
                  className="inline-block cursor-pointer rounded bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500"
                  onClick={() => handleClick()}
                >
                  Add
                </div>
              </div>
            </div>

            <div className="custom-scrollbar border-sky-500 my-3 h-96 w-1/3 overflow-y-scroll rounded-md border py-2 text-center">
              <div className="flex w-full justify-evenly text-center">
                <div className="border-sky-500 rounded-md border p-2 text-sm font-bold text-gray-700">
                  Ques
                </div>

                <div className="border-sky-500 rounded-md border p-2 text-sm font-bold text-gray-700">
                  Max
                </div>

                <div className="border-sky-500 rounded-md border p-2 text-sm font-bold text-gray-700">
                  Marks
                </div>
              </div>
              {Array.isArray(allQuestions) &&
                allQuestions.length > 0 &&
                allQuestions.map(
                  (item, index) =>
                    (item?.primaryQuestion?.length > 0 ||
                      item?.secondaryQuestion?.length > 0) && (
                      <div
                        className="mt-2 flex w-full justify-evenly text-center"
                        key={index}
                      >
                        <div className="border-sky-500 flex w-full justify-evenly rounded-md border bg-gray-200 p-1 text-lg font-medium text-gray-700">
                          <div className="border-sky-500 text-md rounded-md border font-medium text-gray-700">
                            Q.{item.primaryQuestion} ({item.secondaryQuestion})
                          </div>

                          <div className="border-sky-500 text-md rounded-md border font-medium text-gray-700  ">
                            {item.secondaryQuestionMark}
                          </div>

                          <div className="border-sky-500 text-md rounded-md border font-medium text-gray-700">
                            Marks
                          </div>
                          <div className="border-sky-500 m-1 cursor-pointer rounded-md border p-1 text-lg font-bold text-red-500">
                            <VscChromeClose
                              onClick={() => handleCrossClick(index)}
                            />
                          </div>
                        </div>
                      </div>
                    )
                )}
            </div>
          </div>

          {/* Schema Button */}
          <div className="border-sky-500 flex justify-evenly gap-2">
            {/* Add Schema */}
            <div className="hover:bg-transparent group mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-green-800 bg-green-800 px-5 py-3 transition-colors focus:outline-none focus:ring">
              <span className="font-medium text-white transition-colors group-hover:text-indigo-600 group-active:text-indigo-500">
                Add Schema
              </span>

              <span className="border-current shrink-0 rounded-full border bg-white p-2 text-indigo-600 group-active:text-indigo-500">
                <svg
                  className="size-5 rtl:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </div>

            {/* Update Schema */}
            <div className="hover:bg-transparent group mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-orange-900 bg-orange-900 px-5 py-3 transition-colors focus:outline-none focus:ring">
              <span className="font-medium text-white transition-colors group-hover:text-indigo-600 group-active:text-indigo-500">
                Update Schema
              </span>

              <span className="border-current shrink-0 rounded-full border bg-white p-2 text-indigo-600 group-active:text-indigo-500">
                <svg
                  className="size-5 rtl:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </div>

            {/* Copy Schema */}
            <div className="hover:bg-transparent group mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-indigo-600 bg-indigo-600 px-5 py-3 transition-colors focus:outline-none focus:ring">
              <span className="font-medium text-white transition-colors group-hover:text-indigo-600 group-active:text-indigo-500">
                Copy Schema
              </span>

              <span className="border-current shrink-0 rounded-full border bg-white p-2 text-indigo-600 group-active:text-indigo-500">
                <svg
                  className="size-5 rtl:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </div>

            {/* Delete Schema */}
            <div className="hover:bg-transparent group mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-red-600 bg-red-600 px-5 py-3 transition-colors focus:outline-none focus:ring">
              <span className="font-medium text-white transition-colors group-hover:text-indigo-600 group-active:text-indigo-500">
                Delete Schema
              </span>

              <span className="border-current shrink-0 rounded-full border bg-white p-2 text-indigo-600 group-active:text-indigo-500">
                <svg
                  className="size-5 rtl:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
