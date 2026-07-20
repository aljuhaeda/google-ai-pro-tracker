class WebXRUtils {
  static async getXRSession(mode, options) {
    if (!navigator.xr) {
      throw new Error('WebXR not supported');
    }

    const isSupported = await navigator.xr.isSessionSupported(mode);
    if (!isSupported) {
      throw new Error(`${mode} not supported`);
    }

    return await navigator.xr.requestSession(mode, options);
  }

  static createRenderer(session) {
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.setSession(session);
    return renderer;
  }
}