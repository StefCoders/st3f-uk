export interface Project {
	name: string;
	description: string;
	url?: string;
	image?: string;
}

export const projects: Project[] = [
	{
		name: "Moinesti FM",
		description: "Romanian radio station I run, streaming live 24/7.",
		url: "https://moinestifm.ro",
		image: "/projects/moinestifm.png"
	},
	{
		name: "London Romanian Radio",
		description: "A station for the Romanian community in London.",
		url: "https://lrradio.uk",
		image: "/projects/lrradio.png"
	},
	{
		name: "st3f.uk blog",
		description: "My personal site for projects, updates, and experiments.",
		url: "/blog",
		image: "/projects/st3fuk.png"
	}
];
