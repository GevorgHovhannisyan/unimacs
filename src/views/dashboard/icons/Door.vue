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
      <g filter="url(#filter0_d_3_125)">
        <path
          d="M8 18C8 12.4772 12.4772 8 18 8H46C51.5229 8 56 12.4772 56 18V46C56 51.5229 51.5228 56 46 56H18C12.4772 56 8 51.5228 8 46V18Z"
          fill="#10163A"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M41 16.7H23C22.282 16.7 21.7 17.282 21.7 18V46C21.7 46.718 22.282 47.3 23 47.3H41C41.718 47.3 42.3 46.718 42.3 46V18C42.3 17.282 41.718 16.7 41 16.7ZM23 15C21.3431 15 20 16.3431 20 18V46C20 47.6569 21.3431 49 23 49H41C42.6569 49 44 47.6569 44 46V18C44 16.3431 42.6569 15 41 15H23Z"
          fill="#8799BA"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M25 32.7C25.3866 32.7 25.7 32.3866 25.7 32C25.7 31.6134 25.3866 31.3 25 31.3C24.6134 31.3 24.3 31.6134 24.3 32C24.3 32.3866 24.6134 32.7 25 32.7ZM25 34C26.1046 34 27 33.1046 27 32C27 30.8954 26.1046 30 25 30C23.8954 30 23 30.8954 23 32C23 33.1046 23.8954 34 25 34Z"
          fill="#8799BA"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_3_125"
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
            result="effect1_dropShadow_3_125"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_3_125"
            result="shape"
          />
        </filter>
      </defs>
    </svg>

    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      v-else
    >
      <g filter="url(#filter0_d_3_204)">
        <path
          d="M8.5 18C8.5 12.7533 12.7533 8.5 18 8.5H46C51.2467 8.5 55.5 12.7533 55.5 18V46C55.5 51.2467 51.2467 55.5 46 55.5H18C12.7533 55.5 8.5 51.2467 8.5 46V18Z"
          stroke="#10163A"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M41 16.7H23C22.282 16.7 21.7 17.282 21.7 18V46C21.7 46.718 22.282 47.3 23 47.3H41C41.718 47.3 42.3 46.718 42.3 46V18C42.3 17.282 41.718 16.7 41 16.7ZM23 15C21.3431 15 20 16.3431 20 18V46C20 47.6569 21.3431 49 23 49H41C42.6569 49 44 47.6569 44 46V18C44 16.3431 42.6569 15 41 15H23Z"
          fill="#868686"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M25 32.7C25.3866 32.7 25.7 32.3866 25.7 32C25.7 31.6134 25.3866 31.3 25 31.3C24.6134 31.3 24.3 31.6134 24.3 32C24.3 32.3866 24.6134 32.7 25 32.7ZM25 34C26.1046 34 27 33.1046 27 32C27 30.8954 26.1046 30 25 30C23.8954 30 23 30.8954 23 32C23 33.1046 23.8954 34 25 34Z"
          fill="#868686"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_3_204"
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
            result="effect1_dropShadow_3_204"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_3_204"
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
