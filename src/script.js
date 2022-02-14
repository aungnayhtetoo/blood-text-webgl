import './style.css'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'


/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes Helper
const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matCapTexture = textureLoader.load('/textures/matcaps/11.png')
matCapTexture.minFilter = THREE.NearestFilter
matCapTexture.magFilter = THREE.NearestFilter
matCapTexture.generateMipmaps = false

/**
 * Font
 */
const fontLdr = new FontLoader()
fontLdr.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Blood', {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 10,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4,
            }
            
        )

       
        textGeometry.center()

        // Hader way
        // textGeometry.computeBoundingBox()        
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5, // Subtract bevel size
        //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5, // Subtract bevel size
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5  // Subtract bevel thickness
        // )
        // textGeometry.computeBoundingBox()
        // console.log(textGeometry.boundingBox)

        // const textMaterial = new THREE.MeshStandardMaterial()
        // textMaterial.wireframe = true

        const material = new THREE.MeshMatcapMaterial({matcap: matCapTexture})
        const text = new THREE.Mesh(textGeometry, material)


                
        scene.add(text)

        console.time('donuts')

        const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)


        for(let i = 0; i < 300; i++) {
            
            const torus = new THREE.Mesh(torusGeometry, material)

            torus.position.x = (Math.random() - 0.5) * 10
            torus.position.y = (Math.random() - 0.5) * 10
            torus.position.z = (Math.random() - 0.5) * 10

            torus.rotation.x = Math.random() * Math.PI
            torus.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            torus.scale.x = scale
            torus.scale.y = scale
            torus.scale.z = scale

            scene.add(torus)
        }

        console.timeEnd('donuts')
    }
)




/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(2,3,4)

scene.add(pointLight)

// gui.add(pointLight.position, 'x').min(-10).max(10).step(.5)
// gui.add(pointLight.position, 'y').min(-10).max(10).step(.5)
// gui.add(pointLight.position, 'z').min(-10).max(10).step(.5)

 


/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()