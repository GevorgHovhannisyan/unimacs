<template>
  <div>
    <svg
      v-if="theme == 'dark'"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_3_82)">
        <path
          d="M8 18C8 12.4772 12.4772 8 18 8H46C51.5229 8 56 12.4772 56 18V46C56 51.5229 51.5228 56 46 56H18C12.4772 56 8 51.5228 8 46V18Z"
          fill="#10163A"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M25.35 23.2705C25.35 21.2063 27.3237 17.6816 32 17.6816C36.1126 17.6816 38.65 20.3499 38.65 23.2705C38.65 23.7348 39.0306 24.1113 39.5 24.1113C39.9694 24.1113 40.35 23.7348 40.35 23.2705C40.35 19.2668 36.8874 16 32 16C26.2763 16 23.65 20.3887 23.65 23.2705V32.173C23.65 32.2338 23.6565 32.2931 23.6689 32.3503C21.5536 32.9267 20 34.8434 20 37.119V43.0541C20 45.7856 22.2386 48 25 48H39C41.7614 48 44 45.7856 44 43.0541V37.119C44 34.3875 41.7614 32.1731 39 32.1731H25.35C25.35 32.1729 25.35 32.1727 25.35 32.1724V23.2705ZM25 33.8547H39C40.8225 33.8547 42.3 35.3162 42.3 37.119V43.0541C42.3 44.8569 40.8225 46.3184 39 46.3184H25C23.1775 46.3184 21.7 44.8569 21.7 43.0541V37.119C21.7 35.3162 23.1775 33.8547 25 33.8547Z"
          fill="#8799BA"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_3_82"
          x="0"
          y="0"
          width="64"
          height="64"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.190104 0 0 0 0 0.463927 0 0 0 0 0.625 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_3_82"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_3_82"
            result="shape"
          />
        </filter>
      </defs>
    </svg>

    <svg
      v-else
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_3_198)">
        <path
          d="M8.5 18C8.5 12.7533 12.7533 8.5 18 8.5H46C51.2467 8.5 55.5 12.7533 55.5 18V46C55.5 51.2467 51.2467 55.5 46 55.5H18C12.7533 55.5 8.5 51.2467 8.5 46V18Z"
          stroke="#10163A"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M25.35 23.2705C25.35 21.2063 27.3237 17.6816 32 17.6816C36.1126 17.6816 38.65 20.3499 38.65 23.2705C38.65 23.7348 39.0306 24.1113 39.5 24.1113C39.9694 24.1113 40.35 23.7348 40.35 23.2705C40.35 19.2668 36.8874 16 32 16C26.2763 16 23.65 20.3887 23.65 23.2705V32.173C23.65 32.2338 23.6565 32.2931 23.6689 32.3503C21.5536 32.9267 20 34.8434 20 37.119V43.0541C20 45.7856 22.2386 48 25 48H39C41.7614 48 44 45.7856 44 43.0541V37.119C44 34.3875 41.7614 32.1731 39 32.1731H25.35C25.35 32.1729 25.35 32.1727 25.35 32.1724V23.2705ZM25 33.8547H39C40.8225 33.8547 42.3 35.3162 42.3 37.119V43.0541C42.3 44.8569 40.8225 46.3184 39 46.3184H25C23.1775 46.3184 21.7 44.8569 21.7 43.0541V37.119C21.7 35.3162 23.1775 33.8547 25 33.8547Z"
          fill="#868686"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_3_198"
          x="0"
          y="0"
          width="64"
          height="64"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.190104 0 0 0 0 0.463927 0 0 0 0 0.625 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_3_198"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_3_198"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script>
export default {
  computed: {
    theme() {
      return this.$store.state.theme;
    },
  },
};
</script>
