export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
  image: string;
  author: string;
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 1,
    slug: 'solechem-expands-distribution-middle-east',
    title: 'SoleChem Expands Distribution Network Across the Middle East',
    excerpt: 'We are proud to announce new strategic partnerships in the MENA region, strengthening our supply chain capabilities and enabling faster delivery to clients across the Gulf states.',
    content: `SoleChem Europe is thrilled to announce a significant expansion of our distribution network across the Middle East and North Africa (MENA) region. This strategic move comes as part of our long-term growth plan to better serve our clients in one of the world's fastest-growing chemical markets.

Through new partnerships with leading logistics providers and local distributors in the UAE, Saudi Arabia, and Egypt, we are now able to offer dramatically reduced delivery times and improved supply chain reliability for our entire product portfolio of over 4,483 chemicals.

Key highlights of this expansion include:

- New warehousing facilities in Dubai and Riyadh, reducing delivery times by up to 60%
- Dedicated account managers for MENA-based clients, providing localized support in Arabic and English
- Full regulatory compliance support for GCC chemical import requirements
- Competitive pricing through optimized regional logistics

"The Middle East represents a tremendous opportunity for specialty chemical distribution," said our Managing Director. "Our clients in pharmaceuticals, food processing, and petrochemicals deserve the same level of service and speed that our European customers enjoy."

This expansion is expected to be fully operational by Q3 2026, with initial shipments already underway to key accounts in the region. We invite interested buyers to contact our MENA team for partnership inquiries and product availability.`,
    category: 'Partnerships',
    date: '2026-04-28',
    readTime: '4 min read',
    featured: true,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    author: 'SoleChem Europe',
  },
  {
    id: 2,
    slug: 'iso-22000-certification-renewed',
    title: 'ISO 22000:2018 Certification Successfully Renewed',
    excerpt: 'SoleChem has successfully renewed its ISO 22000:2018 certification, reaffirming our commitment to food safety management across our product lines.',
    content: `We are pleased to announce that SoleChem Europe S.r.l. has successfully renewed its ISO 22000:2018 certification following a comprehensive audit by our accredited certification body. This renewal underscores our unwavering commitment to maintaining the highest standards of food safety management in our chemical distribution operations.

The ISO 22000 standard is internationally recognized as the benchmark for food safety management systems. For SoleChem, this certification covers our entire supply chain for food-grade chemicals, from sourcing and procurement through storage, handling, and distribution.

During the audit process, our facilities and procedures were evaluated across multiple criteria:

- Hazard analysis and critical control points (HACCP) implementation
- Traceability systems from raw material to final delivery
- Supplier qualification and monitoring programs
- Storage conditions and contamination prevention measures
- Staff training and competency verification
- Documentation and record-keeping practices

The auditors noted particular strengths in our traceability systems and our proactive approach to supplier management, both of which exceeded baseline requirements.

This certification is essential for our clients in the food and nutrition, pharmaceutical, and personal care industries, providing them with the assurance that our products meet stringent safety requirements at every stage of the supply chain.

We remain committed to continuous improvement and look forward to serving our clients with the highest quality standards in the industry.`,
    category: 'Company News',
    date: '2026-04-15',
    readTime: '3 min read',
    featured: true,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
    author: 'SoleChem Europe',
  },
  {
    id: 3,
    slug: 'new-pharmaceutical-intermediates-line',
    title: 'New Product Line: High-Purity Pharmaceutical Intermediates',
    excerpt: 'Introducing our expanded range of pharmaceutical intermediates, manufactured under strict GMP conditions to meet the demanding requirements of the pharma industry.',
    content: `SoleChem Europe is excited to introduce our expanded portfolio of high-purity pharmaceutical intermediates. This new product line has been developed in response to growing demand from our pharmaceutical clients for reliable, competitively priced intermediates with guaranteed quality specifications.

Our new pharmaceutical intermediates range includes over 150 products across key therapeutic categories, all manufactured under strict Good Manufacturing Practice (GMP) conditions and supported by comprehensive analytical documentation.

Product highlights include:

- Active pharmaceutical ingredient (API) building blocks with purity levels exceeding 99.5%
- Custom synthesis capabilities for proprietary intermediates
- Full documentation package including CoA, MSDS, DMF support, and regulatory dossiers
- Competitive pricing through direct partnerships with qualified manufacturers
- Flexible packaging options from laboratory quantities to multi-ton shipments

Each product undergoes rigorous quality control testing at our partner laboratories, ensuring batch-to-batch consistency and compliance with pharmacopoeial standards (EP, USP, JP).

Our technical team includes experienced pharmaceutical chemists who can assist with product selection, specification development, and regulatory submissions. Whether you are a generic manufacturer, a CDMO, or a research institution, we have the expertise and product range to support your needs.

Contact our pharmaceutical division today to discuss your requirements and request samples.`,
    category: 'Product Updates',
    date: '2026-04-02',
    readTime: '5 min read',
    featured: false,
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1200',
    author: 'SoleChem Europe',
  },
  {
    id: 4,
    slug: 'chemspec-europe-2026-milan',
    title: 'SoleChem at ChemSpec Europe 2026 – Visit Us in Milan',
    excerpt: 'Join us at ChemSpec Europe 2026 in Milan. Meet our team of technical specialists and discover our latest chemical solutions for your industry.',
    content: `SoleChem Europe cordially invites you to visit our booth at ChemSpec Europe 2026, taking place in Milan, Italy. As a Milan-based company, we are excited to host international visitors in our home city and showcase our comprehensive chemical distribution capabilities.

Event details:

- Date: June 18-19, 2026
- Venue: Fiera Milano, Hall 3
- Booth: Stand B42

At our booth, you will be able to:

- Meet our team of technical specialists and discuss your chemical sourcing requirements
- Learn about our latest product additions, including our new pharmaceutical intermediates range
- Discover our custom manufacturing and toll processing capabilities
- Discuss sustainability initiatives and our commitment to green chemistry
- Network with industry peers and explore potential collaborations

We will be hosting a special presentation on "Supply Chain Resilience in European Chemical Distribution" on June 18 at 14:00, featuring insights from our logistics and procurement experts.

Pre-scheduled meetings are available for key accounts and new prospects. To reserve a meeting slot, please contact our events coordinator at events@solechem.eu or fill out the contact form on our website.

We look forward to welcoming you in Milan!`,
    category: 'Events',
    date: '2026-03-20',
    readTime: '2 min read',
    featured: false,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
    author: 'SoleChem Europe',
  },
  {
    id: 5,
    slug: 'sustainability-report-2025',
    title: 'Sustainability Report 2025: Our Commitment to Green Chemistry',
    excerpt: 'Our annual sustainability report highlights key achievements in reducing carbon emissions, sustainable sourcing practices, and our roadmap for a greener future.',
    content: `SoleChem Europe is proud to publish our annual Sustainability Report for 2025, detailing our environmental achievements, ongoing initiatives, and ambitious targets for the years ahead. As a responsible chemical distributor, we recognize our obligation to minimize our environmental impact while continuing to deliver exceptional service to our clients.

Key achievements in 2025:

- 18% reduction in Scope 1 and 2 carbon emissions compared to 2023 baseline
- 92% of our primary suppliers now hold recognized environmental certifications
- Zero hazardous waste incidents across all distribution facilities
- 100% of our packaging materials are now recyclable or reusable
- Implementation of electric vehicle fleet for last-mile deliveries in Northern Italy

Our sustainability strategy is built on four pillars:

1. Carbon Reduction: We are on track to achieve our 2030 target of 50% emissions reduction through energy efficiency improvements, renewable energy procurement, and logistics optimization.

2. Sustainable Sourcing: Our supplier qualification program now includes mandatory environmental criteria, ensuring that our supply chain partners share our commitment to sustainability.

3. Circular Economy: We have implemented take-back programs for IBCs and drums, achieving a 78% container reuse rate across our operations.

4. Community Engagement: Our STEM education partnerships with local schools and universities continue to grow, inspiring the next generation of chemists and engineers.

The full report is available for download on our website. We welcome feedback from our stakeholders and remain committed to transparency in our sustainability journey.`,
    category: 'Company News',
    date: '2026-03-10',
    readTime: '6 min read',
    featured: false,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200',
    author: 'SoleChem Europe',
  },
  {
    id: 6,
    slug: 'global-chemical-market-trends-q1-2026',
    title: 'Global Chemical Market Trends: Q1 2026 Analysis',
    excerpt: 'Our quarterly market analysis covers pricing trends, supply chain disruptions, and demand forecasts for key chemical segments across Europe and Asia.',
    content: `Our quarterly market intelligence report for Q1 2026 provides a comprehensive analysis of global chemical market trends, with a focus on the European and Asian markets that form the core of SoleChem's distribution network.

Executive summary:

The first quarter of 2026 has seen mixed signals across key chemical segments. While demand recovery in the pharmaceutical and food sectors continues to drive growth, the coatings and construction chemicals segments have faced headwinds from ongoing macroeconomic uncertainty.

Key trends by segment:

Organic Acids: Prices have stabilized following the volatility of late 2025, with citric acid and acetic acid showing particular strength due to sustained food industry demand. Supply from Chinese producers has normalized, reducing lead times to pre-2024 levels.

Solvents: The solvents market continues to face pricing pressure from oversupply in certain segments, particularly ethanol and IPA. However, specialty solvents for electronics applications are seeing premium pricing due to growing semiconductor manufacturing capacity.

Pharmaceutical Intermediates: Strong demand continues from generic manufacturers in India and Europe, with particular growth in oncology and CNS therapeutic areas. API building block pricing has increased 5-8% quarter-over-quarter.

Surfactants: The personal care chemicals segment shows robust growth of 6% year-over-year, driven by consumer demand for sustainable and natural formulations. Bio-based surfactants command a 15-20% premium over conventional alternatives.

Supply chain outlook: Overall logistics reliability has improved significantly, with European port congestion largely resolved. However, Red Sea shipping disruptions continue to impact Asia-Europe transit times, adding 7-10 days to typical delivery schedules.

For detailed pricing data and customized market intelligence for your specific product categories, please contact our market research team.`,
    category: 'Industry Insights',
    date: '2026-02-28',
    readTime: '7 min read',
    featured: false,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200',
    author: 'SoleChem Europe',
  },
  {
    id: 7,
    slug: 'new-warehouse-southern-italy',
    title: 'New Warehouse Facility Opens in Southern Italy',
    excerpt: 'Our new 5,000 sqm warehouse in Bari enables faster distribution across Southern Europe and the Mediterranean, reducing delivery times by up to 40%.',
    content: `SoleChem Europe is delighted to announce the official opening of our new warehouse and distribution facility in Bari, Puglia. This 5,000 square meter, state-of-the-art facility represents a significant investment in our Southern European distribution capabilities.

The Bari facility features:

- 5,000 sqm of climate-controlled storage space for sensitive chemicals
- Dedicated hazardous materials storage areas compliant with ADR/RID regulations
- Modern fire suppression and environmental protection systems
- Integrated warehouse management system (WMS) for real-time inventory tracking
- Direct rail connection and proximity to Bari port for multimodal logistics

This strategic location enables us to serve clients across Southern Italy, Greece, the Balkans, and the broader Mediterranean region with significantly reduced delivery times. Initial projections indicate a 40% reduction in average delivery times to clients in these regions.

The facility also supports our growing repackaging and labeling services, allowing us to offer customized packaging solutions closer to our Southern European client base.

The Bari warehouse complements our existing facilities in the Milan metropolitan area, creating a comprehensive distribution network that covers all of Italy and extends efficiently throughout the Mediterranean basin.

We are actively recruiting local logistics and warehouse management professionals to support this expansion. Interested candidates can view open positions on our Sole Talent careers page.`,
    category: 'Company News',
    date: '2026-02-15',
    readTime: '3 min read',
    featured: false,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200',
    author: 'SoleChem Europe',
  },
  {
    id: 8,
    slug: 'strategic-partnership-asian-manufacturers',
    title: 'Strategic Partnership with Leading Asian Manufacturers',
    excerpt: 'SoleChem announces new exclusive distribution agreements with top-tier chemical manufacturers in China and India, expanding our product portfolio significantly.',
    content: `SoleChem Europe has signed exclusive European distribution agreements with three leading chemical manufacturers in China and India, significantly expanding our product portfolio and strengthening our competitive position in the European specialty chemicals market.

These partnerships bring over 200 new products into our catalog, spanning key categories including pharmaceutical intermediates, food additives, electronic chemicals, and specialty surfactants. All partner facilities hold international quality certifications including ISO 9001, ISO 14001, and relevant industry-specific certifications.

Partnership highlights:

Partner 1 (China): A leading producer of food-grade amino acids and vitamins, with annual production capacity exceeding 50,000 MT. This partnership gives SoleChem exclusive European distribution rights for their premium-grade product range.

Partner 2 (India): A vertically integrated pharmaceutical intermediates manufacturer with FDA-inspected facilities. Their portfolio of over 100 API building blocks complements our existing pharmaceutical product line perfectly.

Partner 3 (China): A specialty chemicals producer focused on electronic-grade solvents and high-purity reagents. As the semiconductor industry grows in Europe, this partnership positions SoleChem to serve this emerging demand.

All three partnerships include:

- Exclusive European distribution rights for specified product ranges
- Guaranteed supply volumes with annual commitment agreements
- Joint quality assurance programs with regular facility audits
- Collaborative product development for custom specifications
- Shared market intelligence and demand forecasting

These partnerships reflect our strategy of building deep, long-term relationships with best-in-class manufacturers. By combining their production expertise with our European distribution network and regulatory knowledge, we create value for our clients through reliable supply, competitive pricing, and comprehensive technical support.

For product inquiries related to our expanded portfolio, please contact our commercial team.`,
    category: 'Partnerships',
    date: '2026-01-30',
    readTime: '4 min read',
    featured: false,
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200',
    author: 'SoleChem Europe',
  },
];
