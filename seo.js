(function () {
  const metaTags = [
    { name: "description", content: "Emergency cash loans information and resources" },
    { name: "robots", content: "index, follow" },

    { property: "og:title", content: "Emergency Cash Loans" },
    { property: "og:description", content: "Fast access to emergency cash loan resources" },
    { property: "og:url", content: "https://brightlane.github.io/emergencycashloans/" },
    { property: "og:type", content: "website" },

    { name: "twitter:card", content: "summary" }
  ];

  metaTags.forEach(tag => {
    const meta = document.createElement("meta");

    if (tag.name) meta.setAttribute("name", tag.name);
    if (tag.property) meta.setAttribute("property", tag.property);

    meta.setAttribute("content", tag.content);
    document.head.appendChild(meta);
  });
})();
