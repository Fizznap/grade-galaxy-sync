import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DORdWICZ.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as score } from "./scoring-bzfziPB5.mjs";
import { n as cn, t as Button } from "./button-D4TI73S7.mjs";
import { f as Send, y as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as askInsights } from "./ai.functions-CTSwYEur.mjs";
import { t as Input } from "./input-BqL9iJXA.mjs";
import { a as ScrollAreaViewport, i as ScrollAreaThumb, n as ScrollAreaCorner, r as ScrollAreaScrollbar, t as ScrollArea$1 } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student-dashboard-2ibVTQIi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScrollArea$1, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaViewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaCorner, {})
	]
}));
ScrollArea.displayName = ScrollArea$1.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
function StudentDashboard() {
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const { data: student, isLoading } = useQuery({
		queryKey: ["student-profile"],
		queryFn: async () => {
			const { data: userData } = await supabase.auth.getUser();
			if (!userData.user) throw new Error("Not logged in");
			const { data, error } = await supabase.from("students").select("*").eq("user_id", userData.user.id).single();
			if (error) throw error;
			return score(data);
		}
	});
	const chatMutation = useMutation({
		mutationFn: async (msgs) => {
			return askInsights({ data: { messages: msgs } });
		},
		onSuccess: (data) => {
			if (data.error) setMessages((prev) => [...prev, {
				role: "assistant",
				content: `Error: ${data.error}`
			}]);
			else if (data.reply) setMessages((prev) => [...prev, {
				role: "assistant",
				content: data.reply
			}]);
		}
	});
	const handleSend = () => {
		if (!input.trim() || chatMutation.isPending) return;
		const newMsgs = [...messages, {
			role: "user",
			content: input
		}];
		setMessages(newMsgs);
		setInput("");
		chatMutation.mutate(newMsgs);
	};
	const renderMessageContent = (content) => {
		try {
			const json = JSON.parse(content);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-primary block",
						children: "Summary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: json.summary
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-green-600 block",
							children: "Strengths"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "list-disc pl-4 text-sm",
							children: json.strengths?.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, i))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-orange-600 block",
							children: "Areas for Improvement"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "list-disc pl-4 text-sm",
							children: json.improvement_areas?.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, i))
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-blue-600 block",
						children: "Recommended Actions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "list-disc pl-4 text-sm",
						children: json.recommended_actions?.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, i))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground bg-muted p-2 rounded",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Timeline: ", json.suggested_timeline] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Caveats: ", json.caveats] })]
					})
				]
			});
		} catch (e) {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm whitespace-pre-wrap",
				children: content
			});
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" })
	});
	if (!student) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-red-500",
		children: "Failed to load student profile"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container mx-auto p-4 md:p-8 grid lg:grid-cols-3 gap-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-1 space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: ["Welcome, ", student.name]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Success Metrics" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: "Success Score"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-bold text-primary",
							children: [student.successScore, "/100"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full bg-secondary rounded-full h-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-primary rounded-full h-2",
							style: { width: `${student.successScore}%` }
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4 pt-4 border-t",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground uppercase",
							children: "Academic Risk"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `font-bold ${student.academicRisk === "High" ? "text-red-500" : student.academicRisk === "Medium" ? "text-orange-500" : "text-green-500"}`,
							children: student.academicRisk
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground uppercase",
							children: "Placement Risk"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `font-bold ${student.placementRisk === "High" ? "text-red-500" : student.placementRisk === "Medium" ? "text-orange-500" : "text-green-500"}`,
							children: student.placementRisk
						})] })]
					}),
					student.riskFactors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 border-t",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground uppercase mb-2",
							children: "Risk Factors Identified"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "text-sm space-y-1",
							children: student.riskFactors.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-red-500" }),
									" ",
									r
								]
							}, i))
						})]
					})
				]
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:col-span-2 flex flex-col max-h-[80vh]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex flex-col flex-1 shadow-md border-border overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "bg-muted/30 border-b",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "AI Academic Advisor" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex-1 p-0 flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
						className: "flex-1 p-4",
						style: { height: "400px" },
						children: messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full flex flex-col items-center justify-center text-muted-foreground space-y-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Ask about your performance, next steps, or placement readiness." })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `flex ${m.role === "user" ? "justify-end" : "justify-start"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `max-w-[85%] rounded-lg p-4 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted border"}`,
									children: m.role === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: m.content
									}) : renderMessageContent(m.content)
								})
							}, i)), chatMutation.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-start",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-w-[85%] rounded-lg p-4 bg-muted border flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm",
											children: "Thinking..."
										})
									]
								})
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 border-t bg-background",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: (e) => {
								e.preventDefault();
								handleSend();
							},
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: input,
								onChange: (e) => setInput(e.target.value),
								placeholder: "Ask your advisor...",
								disabled: chatMutation.isPending,
								className: "flex-1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: !input.trim() || chatMutation.isPending,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4" })
							})]
						})
					})]
				})]
			})
		})]
	});
}
//#endregion
export { StudentDashboard as component };
