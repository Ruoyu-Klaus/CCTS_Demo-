export default {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  packageOptions: {},
  plugins: ['@snowpack/plugin-typescript'],
}
