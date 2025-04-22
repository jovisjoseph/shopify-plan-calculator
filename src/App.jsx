import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  // Default plan details
  const defaultPlans = [
    {
      name: "Starter",
      monthlyCost: 5,
      onlineRate: 0.05,
      onlineFee: 0.3,
      color: "#34D399",
    },
    {
      name: "Basic",
      monthlyCost: 39,
      onlineRate: 0.029,
      onlineFee: 0.3,
      color: "#60A5FA",
    },
    {
      name: "Shopify",
      monthlyCost: 105,
      onlineRate: 0.027,
      onlineFee: 0.3,
      color: "#8B5CF6",
    },
    {
      name: "Advanced",
      monthlyCost: 399,
      onlineRate: 0.025,
      onlineFee: 0.3,
      color: "#F87171",
    },
    {
      name: "Plus",
      monthlyCost: 2400,
      onlineRate: 0,
      onlineFee: 0,
      color: "#000000",
    },
  ];

  // State variables
  const [plans, setPlans] = useState(defaultPlans);
  const [aov, setAOV] = useState(100);
  const [orderCount, setOrderCount] = useState(50);
  const [results, setResults] = useState([]);
  const [breakeven, setBreakeven] = useState([]);

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

        // Only include positive breakeven points
        if (breakevenOrderCount > 0) {
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
    <BrowserRouter>
      <div className="p-6 max-w-7xl bg-gray-100 font-sans">
        <div className="flex justify-between items-center  mb-6  border-b pb-4">
          <div className="max-w-2xl mr-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Shopify Plan Calculator
            </h1>
            <p className="text-sm text-gray-400 mt-2 ">
              Every single variable in this calculator is editable. Default
              values are set on basis of US Shopify plans. To know plans in your
              region visit{" "}
              <a
                target="_blank"
                href="https://www.shopify.com/pricing"
                className="font-bold underline  hover:text-gray-800"
              >
                Shopify Pricing Page
              </a>
            </p>
          </div>
          <button
            onClick={resetToDefaults}
            className="text-sm mt-6 px-6 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset to Defaults
          </button>
        </div>

        {/* Main calculator inputs */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-indigo-800">
            Store Parameters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Average Order Value ($)
              </label>
              <input
                type="number"
                value={aov}
                onChange={(e) => handleInputChange(e, setAOV)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all"
                min="1"
                step="1"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Monthly Order Count
              </label>
              <input
                type="number"
                value={orderCount}
                onChange={(e) => handleInputChange(e, setOrderCount)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all"
                min="1"
                step="1"
              />
            </div>
          </div>
          <p className="text-center text-sm text-indigo-400 mt-5 ">
            Need better AOV? May be a convertion optimised cart might be the
            answer.{" "}
            <a
              target="_blank"
              href="https://apps.shopify.com/cornercart"
              className="font-bold underline  hover:text-indigo-800"
            >
              Checkout CornerCart
            </a>
          </p>
        </div>

        {/* Plan configuration */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Plan Details
          </h2>
          <div className="overflow-x-auto shadow-md bg-white rounded-lg">
            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                  <th className="py-3 px-4 border-b">Plan</th>
                  <th className="py-3 px-4 border-b">Monthly Fee ($)</th>
                  <th className="py-3 px-4 border-b">Transaction Rate (%)</th>
                  <th className="py-3 px-4 border-b">
                    Per Transaction Fee ($)
                  </th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, index) => (
                  <tr
                    key={plan.name}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td
                      className="py-3 px-4 border-b font-medium"
                      style={{ borderLeft: `4px solid ${plan.color}` }}
                    >
                      {plan.name}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <input
                        type="number"
                        value={plan.monthlyCost}
                        onChange={(e) =>
                          updatePlan(index, "monthlyCost", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="py-3 px-4 border-b">
                      <input
                        type="number"
                        value={plan.onlineRate * 100}
                        onChange={(e) =>
                          updatePlan(index, "onlineRate", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="py-3 px-4 border-b">
                      <input
                        type="number"
                        value={plan.onlineFee}
                        onChange={(e) =>
                          updatePlan(index, "onlineFee", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all"
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

        {/* Results */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Cost Comparison
          </h2>
          <div className="overflow-x-auto shadow-md bg-white rounded-lg">
            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                  <th className="py-3 px-4 border-b">Rank</th>
                  <th className="py-3 px-4 border-b">Plan</th>
                  <th className="py-3 px-4 border-b">Monthly Fee</th>
                  <th className="py-3 px-4 border-b">Transaction Fees</th>
                  <th className="py-3 px-4 border-b">Total Monthly Cost</th>
                  <th className="py-3 px-4 border-b">Cost Per Order</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => {
                  const planColor =
                    plans.find((p) => p.name === result.name)?.color || "#000";
                  return (
                    <tr
                      key={result.name}
                      className={
                        index === 0
                          ? "bg-green-50 hover:bg-green-100 transition-colors"
                          : "hover:bg-gray-50 transition-colors"
                      }
                    >
                      <td className="py-3 px-4 border-b text-center">
                        {index === 0 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded-full font-bold">
                            1
                          </span>
                        ) : (
                          <span className="text-gray-600">{index + 1}</span>
                        )}
                      </td>
                      <td
                        className="py-3 px-4 border-b font-medium"
                        style={{ borderLeft: `4px solid ${planColor}` }}
                      >
                        {result.name}
                        {index === 0 && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Best Value
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 border-b">
                        ${result.monthlySubscription.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 border-b">
                        ${result.transactionFees.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 border-b font-semibold">
                        ${result.totalCost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 border-b">
                        ${result.costPerOrder.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Breakeven Points */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Breakeven Points
          </h2>
          {breakeven.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {breakeven.map((point, index) => {
                const plan1Color =
                  plans.find((p) => p.name === point.plan1)?.color || "#000";
                const plan2Color =
                  plans.find((p) => p.name === point.plan2)?.color || "#000";
                return (
                  <div
                    key={index}
                    className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-3">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: plan1Color }}
                      ></div>
                      <span className="font-semibold">{point.plan1}</span>
                      <svg
                        className="w-6 h-6 mx-2 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        ></path>
                      </svg>
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: plan2Color }}
                      ></div>
                      <span className="font-semibold">{point.plan2}</span>
                    </div>
                    <div className="text-center bg-white p-3 rounded-lg shadow-inner">
                      <span className="text-2xl font-bold text-indigo-700">
                        {point.orderCount}
                      </span>
                      <span className="text-sm text-gray-600 block">
                        orders/month
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              No relevant breakeven points found with current settings.
            </div>
          )}
        </div>

        {/* Formula explanation */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-sm mb-4 border border-gray-200">
          <h3 className="font-semibold mb-3 text-gray-800">How We Calculate</h3>
          <div className="space-y-2">
            <div className="p-3 bg-white rounded border border-gray-200">
              <p className="font-medium text-gray-800">Total Monthly Cost</p>
              <p className="text-gray-600">= Monthly Fee + Transaction Fees</p>
            </div>
            <div className="p-3 bg-white rounded border border-gray-200">
              <p className="font-medium text-gray-800">Transaction Fees</p>
              <p className="text-gray-600">
                = Order Count × (AOV × Transaction Rate + Per-Transaction Fee)
              </p>
            </div>
            <div className="p-3 bg-white rounded border border-gray-200">
              <p className="font-medium text-gray-800">Breakeven Point</p>
              <p className="text-gray-600">
                = Monthly Fee Difference ÷ (AOV × Rate Difference + Fixed Fee
                Difference)
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5 ">
          Made with ❤️ by{" "}
          <a
            target="_blank"
            href="https://apps.shopify.com/cornercart"
            className="font-bold underline  hover:text-gray-800"
          >
            CornerCart Team
          </a>
        </p>
      </div>
    </BrowserRouter>
  );
}

export default App;
