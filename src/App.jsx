import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  // Default plan details with enhanced styling
  const defaultPlans = [
    {
      name: "Starter",
      monthlyCost: 5,
      onlineRate: 0.05,
      onlineFee: 0.3,
      color: "#10B981",
      bgGradient: "from-green-50 to-green-100",
    },
    {
      name: "Basic",
      monthlyCost: 39,
      onlineRate: 0.029,
      onlineFee: 0.3,
      color: "#3B82F6",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      name: "Shopify",
      monthlyCost: 105,
      onlineRate: 0.027,
      onlineFee: 0.3,
      color: "#8B5CF6",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      name: "Advanced",
      monthlyCost: 399,
      onlineRate: 0.025,
      onlineFee: 0.3,
      color: "#EF4444",
      bgGradient: "from-red-50 to-red-100",
    },
    {
      name: "Plus",
      monthlyCost: 2400,
      onlineRate: 0.02,
      onlineFee: 0.0,
      color: "#000000",
      bgGradient: "from-gray-50 to-gray-200",
    },
  ];

  // State variables
  const [plans, setPlans] = useState(defaultPlans);
  const [aov, setAOV] = useState(100);
  const [orderCount, setOrderCount] = useState(50);
  const [results, setResults] = useState([]);
  const [breakeven, setBreakeven] = useState([]);
  const [selectedTab, setSelectedTab] = useState("calculator"); // 'calculator' or 'about'

  // Calculate results whenever inputs change
  useEffect(() => {
    calculateResults();
  }, [aov, orderCount, plans]);

  // Calculate results based on current inputs
  const calculateResults = () => {
    // Calculate total cost for each plan
    const calculatedResults = plans.map((plan) => {
      const monthlySubscription = plan.monthlyCost;
      const transactionFees =
        orderCount * (aov * plan.onlineRate + plan.onlineFee);
      const totalCost = monthlySubscription + transactionFees;

      return {
        ...plan,
        monthlySubscription,
        transactionFees,
        totalCost,
        costPerOrder: totalCost / (orderCount || 1),
      };
    });

    // Sort by total cost (lowest first)
    calculatedResults.sort((a, b) => a.totalCost - b.totalCost);
    setResults(calculatedResults);

    // Calculate breakeven points
    calculateBreakeven();
  };

  // Find breakeven points between plans
  const calculateBreakeven = () => {
    const breakPoints = [];

    // Define the upgrade path
    const upgradePath = ["Starter", "Basic", "Shopify", "Advanced", "Plus"];

    // Compare each plan with the next plan in the upgrade path
    for (let i = 0; i < upgradePath.length - 1; i++) {
      const plan1Name = upgradePath[i];
      const plan2Name = upgradePath[i + 1];

      // Find the plan objects
      const plan1 = plans.find((p) => p.name === plan1Name);
      const plan2 = plans.find((p) => p.name === plan2Name);

      if (plan1 && plan2) {
        // Calculate breakeven point
        const feeRateDiff = plan2.onlineRate - plan1.onlineRate;
        const fixedFeeDiff = plan1.onlineFee - plan2.onlineFee;
        const subscriptionDiff = plan1.monthlyCost - plan2.monthlyCost;

        // Calculate breakeven order count
        const breakevenOrderCount = Math.ceil(
          subscriptionDiff / (aov * feeRateDiff + fixedFeeDiff)
        );

        // Only include positive breakeven points that make sense
        if (breakevenOrderCount > 0 && breakevenOrderCount < 100000) {
          breakPoints.push({
            plan1: plan1.name,
            plan2: plan2.name,
            orderCount: breakevenOrderCount,
            subscriptionDiff,
            feeRateDiff,
          });
        }
      }
    }

    setBreakeven(breakPoints);
  };

  // Update plan values
  const updatePlan = (index, field, value) => {
    const updatedPlans = [...plans];

    // Convert percentages for onlineRate
    if (field === "onlineRate") {
      updatedPlans[index][field] = parseFloat(value) / 100;
    } else {
      updatedPlans[index][field] = parseFloat(value);
    }

    setPlans(updatedPlans);
  };

  // Handle input changes
  const handleInputChange = (e, setter) => {
    const value = e.target.value;
    if (value === "" || !isNaN(value)) {
      setter(value === "" ? "" : parseFloat(value));
    }
  };

  // Reset to default values
  const resetToDefaults = () => {
    setPlans([...defaultPlans]);
    setAOV(100);
    setOrderCount(50);
  };

  // Render component
  return (
    <div className="min-h-screen  py-8 px-4 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 px-8 py-6 text-white">
          <div className="absolute top-0 right-0 w-full h-full opacity-20"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Shopify Plan Calculator</h1>
              <p className="mt-2 text-blue-100">
                Find the most cost-effective plan for your business
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedTab("calculator")}
                className={`px-4 py-2 rounded-md transition-all ${
                  selectedTab === "calculator"
                    ? "bg-white text-indigo-700 shadow-md"
                    : "bg-indigo-700/40 text-white hover:bg-indigo-700/60"
                }`}
              >
                Calculator
              </button>
              <button
                onClick={() => setSelectedTab("about")}
                className={`px-4 py-2 rounded-md transition-all ${
                  selectedTab === "about"
                    ? "bg-white text-indigo-700 shadow-md"
                    : "bg-indigo-700/40 text-white hover:bg-indigo-700/60"
                }`}
              >
                About
              </button>
            </div>
          </div>
        </div>

        {selectedTab === "calculator" ? (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500 max-w-3xl mr-4">
                Every variable in this calculator is editable. Default values
                are based on US Shopify plans. To see plans in your region,
                visit the{" "}
                <a
                  href="https://www.shopify.com/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-medium underline"
                >
                  Shopify Pricing Page
                </a>
                .
              </p>
              <button
                onClick={resetToDefaults}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all shadow-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
                Reset to Defaults
              </button>
            </div>

            {/* Main calculator inputs */}
            <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-sm border border-blue-100">
              <h2 className="text-xl font-bold mb-6 text-indigo-800 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  ></path>
                </svg>
                Store Parameters
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <label className="block text-indigo-800 font-medium mb-2">
                    Average Order Value ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={aov}
                      onChange={(e) => handleInputChange(e, setAOV)}
                      className="w-full p-3 pl-8 border border-indigo-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all"
                      min="1"
                      step="1"
                    />
                  </div>
                  <p className="mt-2 text-xs text-indigo-600">
                    The average value of each order in your store
                  </p>
                </div>
                <div className="relative">
                  <label className="block text-indigo-800 font-medium mb-2">
                    Monthly Order Count
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      #
                    </span>
                    <input
                      type="number"
                      value={orderCount}
                      onChange={(e) => handleInputChange(e, setOrderCount)}
                      className="w-full p-3 pl-8 border border-indigo-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all"
                      min="1"
                      step="1"
                    />
                  </div>
                  <p className="mt-2 text-xs text-indigo-600">
                    The number of orders you process each month
                  </p>
                </div>
              </div>

              <div className="mt-6 p-3 bg-white/70 rounded-lg border border-indigo-100 flex items-center">
                <svg
                  className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <p className="text-sm text-gray-600">
                  Need a better AOV? A conversion-optimized cart might be the
                  answer.{" "}
                  <a
                    href="https://apps.shopify.com/cornercart"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    Check out CornerCart
                  </a>
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
                Cost Comparison
              </h2>
              <div className="overflow-x-auto shadow-lg rounded-xl">
                <table className="min-w-full bg-white border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold rounded-tl-xl">
                        Rank
                      </th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                        Plan
                      </th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                        Monthly Fee
                      </th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                        Transaction Fees
                      </th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                        Total Monthly Cost
                      </th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold rounded-tr-xl">
                        Cost Per Order
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => {
                      const planColor =
                        plans.find((p) => p.name === result.name)?.color ||
                        "#000";
                      const bgGradient =
                        plans.find((p) => p.name === result.name)?.bgGradient ||
                        "from-gray-50 to-gray-100";
                      return (
                        <tr
                          key={result.name}
                          className={
                            index === 0
                              ? `bg-gradient-to-r ${bgGradient} hover:opacity-90 transition-opacity`
                              : "hover:bg-gray-50 transition-colors border-t border-gray-100"
                          }
                        >
                          <td className="py-4 px-4">
                            {index === 0 ? (
                              <div className="flex justify-center items-center w-8 h-8 bg-white text-green-700 rounded-full font-bold shadow-sm border-2 border-green-500">
                                {index + 1}
                              </div>
                            ) : (
                              <div className="flex justify-center items-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full">
                                {index + 1}
                              </div>
                            )}
                          </td>
                          <td
                            className="py-4 px-4 font-medium relative"
                            style={{ borderLeft: `4px solid ${planColor}` }}
                          >
                            <div className="flex items-center">
                              <div className="mr-3">
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm"
                                  style={{ backgroundColor: planColor }}
                                >
                                  {result.name.substring(0, 2)}
                                </div>
                              </div>
                              <div>
                                <div className="font-bold text-gray-800">
                                  {result.name}
                                </div>
                                {index === 0 && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                    Best Value
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium">
                              ${result.monthlySubscription.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Base fee
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium">
                              ${result.transactionFees.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              For {orderCount} orders
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div
                              className="text-lg font-bold"
                              style={{ color: planColor }}
                            >
                              ${result.totalCost.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Total cost
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium">
                              ${result.costPerOrder.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Per order
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Plan configuration */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  ></path>
                </svg>
                Plan Details
              </h2>
              <div className="overflow-x-auto shadow-lg rounded-xl">
                <table className="min-w-full bg-white border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold rounded-tl-xl">
                        Plan
                      </th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                        Monthly Fee ($)
                      </th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                        Transaction Rate (%)
                      </th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold rounded-tr-xl">
                        Per Transaction Fee ($)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan, index) => (
                      <tr
                        key={plan.name}
                        className={`hover:bg-gradient-to-r ${plan.bgGradient} transition-colors`}
                      >
                        <td
                          className="py-4 px-4 font-medium relative"
                          style={{ borderLeft: `4px solid ${plan.color}` }}
                        >
                          <div className="flex items-center">
                            <div className="mr-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm"
                                style={{ backgroundColor: plan.color }}
                              >
                                {plan.name.substring(0, 2)}
                              </div>
                            </div>
                            <div className="font-bold text-gray-800">
                              {plan.name}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="number"
                            value={plan.monthlyCost}
                            onChange={(e) =>
                              updatePlan(index, "monthlyCost", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="number"
                            value={plan.onlineRate * 100}
                            onChange={(e) =>
                              updatePlan(index, "onlineRate", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="number"
                            value={plan.onlineFee}
                            onChange={(e) =>
                              updatePlan(index, "onlineFee", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all"
                            min="0"
                            step="0.01"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Breakeven Points */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  ></path>
                </svg>
                Breakeven Points
              </h2>
              {breakeven.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {breakeven.map((point, index) => {
                    const plan1 = plans.find((p) => p.name === point.plan1);
                    const plan2 = plans.find((p) => p.name === point.plan2);
                    const plan1Color = plan1?.color || "#000";
                    const plan2Color = plan2?.color || "#000";

                    return (
                      <div
                        key={index}
                        className="p-5 border border-gray-200 rounded-xl shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm mr-2"
                              style={{ backgroundColor: plan1Color }}
                            >
                              {point.plan1.substring(0, 2)}
                            </div>
                            <span className="font-bold text-gray-800">
                              {point.plan1}
                            </span>
                          </div>
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 5l7 7-7 7M5 5l7 7-7 7"
                            ></path>
                          </svg>
                          <div className="flex items-center">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm mr-2"
                              style={{ backgroundColor: plan2Color }}
                            >
                              {point.plan2.substring(0, 2)}
                            </div>
                            <span className="font-bold text-gray-800">
                              {point.plan2}
                            </span>
                          </div>
                        </div>
                        <div className="text-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <span
                            className="text-3xl font-bold"
                            style={{ color: plan2Color }}
                          >
                            {point.orderCount}
                          </span>
                          <span className="text-sm text-gray-600 block mt-1">
                            orders/month
                          </span>
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-600">
                              Switch plans at this order volume
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 flex items-center">
                  <svg
                    className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <div>
                    <p className="font-medium">
                      No relevant breakeven points found with current settings.
                    </p>
                    <p className="text-sm mt-1">
                      Try adjusting your AOV or plan parameters to find upgrade
                      opportunities.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Formula explanation */}
            <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold mb-4 text-gray-800 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
                How We Calculate
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                  <p className="font-medium text-gray-800 mb-1">
                    Total Monthly Cost
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center mr-3">
                      $
                    </div>
                    <p className="text-gray-600">
                      Monthly Fee + Transaction Fees
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                  <p className="font-medium text-gray-800 mb-1">
                    Transaction Fees
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center mr-3">
                      %
                    </div>
                    <p className="text-gray-600">
                      Order Count × (AOV × Transaction Rate + Per-Transaction
                      Fee)
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                  <p className="font-medium text-gray-800 mb-1">
                    Breakeven Point
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center mr-3">
                      #
                    </div>
                    <p className="text-gray-600">
                      Monthly Fee Difference ÷ (AOV × Rate Difference + Fixed
                      Fee Difference)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                About This Calculator
              </h2>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-indigo-700">
                  What is this tool?
                </h3>
                <p className="text-gray-600 mb-4">
                  This Shopify Plan Calculator helps merchants find the most
                  cost-effective Shopify plan based on their specific business
                  metrics. By considering your average order value (AOV) and
                  monthly order volume, we calculate the total costs and
                  identify optimal breakeven points for plan upgrades.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-indigo-700">
                  How do I use it?
                </h3>
                <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                  <li>
                    Enter your store's <strong>Average Order Value</strong>{" "}
                    (AOV)
                  </li>
                  <li>
                    Input your expected <strong>Monthly Order Count</strong>
                  </li>
                  <li>
                    View the <strong>Cost Comparison</strong> to see which plan
                    offers the best value
                  </li>
                  <li>
                    Check the <strong>Breakeven Points</strong> to understand
                    when upgrading makes financial sense
                  </li>
                  <li>
                    If needed, adjust the plan details to match your specific
                    regional pricing
                  </li>
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-indigo-700">
                  Why trust this calculator?
                </h3>
                <p className="text-gray-600 mb-4">
                  This calculator uses straightforward, transparent formulas to
                  determine costs. All calculations are done in real-time based
                  on the parameters you provide, with no hidden variables or
                  assumptions.
                </p>
                <div className="flex items-start mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <svg
                    className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <p className="text-sm text-blue-800">
                    <strong>Remember:</strong> While this calculator provides
                    accurate cost comparisons, your final decision should
                    consider other factors like plan features, additional tools,
                    and business needs.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 mt-8">
                <h3 className="text-lg font-semibold mb-3 text-indigo-700">
                  Need help with your Shopify store?
                </h3>
                <p className="text-gray-600 mb-4">
                  Optimize your store's conversion rate with CornerCart - a
                  conversion-focused cart solution designed to boost your AOV
                  and decrease cart abandonment.
                </p>
                <a
                  href="https://apps.shopify.com/cornercart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Learn More About CornerCart
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Made with ❤️ by{" "}
            <a
              href="https://apps.shopify.com/cornercart"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 hover:text-indigo-800"
            >
              CornerCart Team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
