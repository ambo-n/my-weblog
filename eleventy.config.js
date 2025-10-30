import {
	IdAttributePlugin,
	InputPathToUrlTransformPlugin,
	HtmlBasePlugin,
} from "@11ty/eleventy";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import pluginFilters from "./_config/filters.js";
import container from "markdown-it-container";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
	// --- Markdown setup ---
	const markdownLib = markdownIt({
		html: true,
		breaks: true,
		linkify: true,
	})
		.use(markdownItAnchor, { permalink: false })
		.use(container, "tip", {
			render(tokens, idx) {
				const token = tokens[idx];
				return token.nesting === 1
					? '<div class="callout tip"><strong>💡 Tip</strong><br>'
					: "</div>\n";
			},
		})
		.use(container, "warning", {
			render(tokens, idx) {
				const token = tokens[idx];
				return token.nesting === 1
					? '<div class="callout warning"><strong>⚠️ Warning</strong><br>'
					: "</div>\n";
			},
		});

	eleventyConfig.setLibrary("md", markdownLib);

	// --- Drafts ---
	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if (data.draft) data.title = `${data.title} (draft)`;
		if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") return false;
	});

	// --- Passthrough Copy ---
	eleventyConfig
		.addPassthroughCopy({ "./public/": "/" })
		.addPassthroughCopy("./content/feed/pretty-atom-feed.xsl");

	// --- Watch Targets ---
	eleventyConfig.addWatchTarget("css/**/*.css");
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}");

	// --- Bundles ---
	eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
		bundleHtmlContentFromSelector: "style",
	});
	eleventyConfig.addBundle("js", {
		toFileDirectory: "dist",
		bundleHtmlContentFromSelector: "script",
	});

	// --- Plugins ---
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 },
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		formats: ["avif", "webp", "auto"],
		failOnError: false,
		htmlOptions: {
			imgAttributes: {
				loading: "lazy",
				decoding: "async",
			},
		},
		sharpOptions: { animated: true },
	});
	eleventyConfig.addPlugin(pluginFilters);
	eleventyConfig.addPlugin(IdAttributePlugin);

	eleventyConfig.addShortcode("currentBuildDate", () =>
		new Date().toISOString()
	);
}

export const config = {
	templateFormats: ["md", "njk", "html", "liquid", "11ty.js"],
	markdownTemplateEngine: "njk",
	htmlTemplateEngine: "njk",
	dir: {
		input: "content",
		includes: "../_includes",
		data: "../_data",
		output: "_site",
	},
};
