/* VARIABLES */
const page = document.getElementById('page'),
    loading = document.getElementById('loading'),
    slider = document.querySelector('.swiper'),
    inner1 = document.getElementById('inner-1'),
    inner2 = document.getElementById('inner-2'),
    inner3 = document.getElementById('inner-3'),
    carViewer = document.getElementById('car-viewer'),
    slideToButtons = document.querySelectorAll('[data-slide-to]'),
    colorButtons = document.querySelectorAll('[data-color]'),
    title = document.querySelectorAll('.title'),
    bgImage = document.querySelector('picture'),
    dontknow=document.getElementById('dont_know')
    carModelSelector = document.getElementById('car-model');

const innerAnimationActive = {
    duration: 1,
    delay: 0.5,
    ease: Power4.easeOut,
    autoAlpha: 1,
    yPercent: 0,
};
const innerAnimationHidden = {
    duration: 1,
    ease: Power4.easeOut,
    autoAlpha: 0,
    yPercent: -20,
};

const carModels = {
    model1: {
        src: "/models/MS_JIMMY/scene1.gltf",
        paintIndices: [0, 4],
        scale: "1.1 1.1 1.1",
        cameraSettings: {
            orbit1: "0deg 75deg 2m",
            orbit2: "-60deg 75deg 2.5m",
            orbit3: "44deg 75deg 2m",
            mobileOrbit1: "0deg 75deg 2m",
            mobileOrbit2: "-60deg 75deg 2.5m",
            mobileOrbit3: "44deg 75deg 3m",
            target1: "0m 0.3m 0m",
            target2: "0m 0.7m 1.8m",
            target3: "-0.5m 0.4m 0m",
            mobileTarget1: "0m 0.15m 0m",
            mobileTarget2: "-1.4m 0.7m 1.8m",
            mobileTarget3: "0.0m 0.40m 0.9m"
        },
        exposure: "0.5"
    },
    model2: {
        src: "/models/MS_SWIFT/scene.gltf",
        paintIndices: [13, 22],
        scale: "0.5 0.5 0.5",
        cameraSettings: {
            orbit1: "0deg 75deg 6m",
            orbit2: "-60deg 75deg 0.5m",
            orbit3: "44deg 75deg 6m",
            mobileOrbit1: "0deg 75deg 7m",
            mobileOrbit2: "-60deg 75deg 8.5m",
            mobileOrbit3: "44deg 75deg 7m",
            target1: "0m 0m 0m",
            target2: "0m 1m 2.5m",
            target3: "m 0.6m 1.1m",
            mobileTarget1: "0m 0m 0m",
            mobileTarget2: "1.5m -0.25m 0.5m",
            mobileTarget3: "0.3m 0.4m 1.4m"
        },
        exposure: "0.3"
    },
    model3: {
        src: "/models/MS_CIAZ/scene.gltf",
        paintIndices: [13,55,7,6,5,4,17,11,16],
        scale: "1 1 1",
        cameraSettings: {
          orbit1: "180deg 75deg 1.5m",
          orbit2: "120deg 75deg 1.5m",
          orbit3: "224deg 75deg 1.5m",
          mobileOrbit1: "180deg 75deg 1.5m",
          mobileOrbit2: "120deg 75deg 1.5m",
          mobileOrbit3: "224deg 75deg 1.5m",
          target1: "0m 0.35m 0m",
          target2: "0.2m 0.6m -1.5m",
          target3: "-0.5m 0.9m -1.0m",
          mobileTarget1: "0m 0.15m 0m",
          mobileTarget2: "2.8m 1.0m -1.7m",
          mobileTarget3: "-1.5m 1.0m -1.7m"
        },
        exposure:"0.5"
      },
};


let currentModel;
let target1, target2, target3;

/* VERTICAL SLIDER */
const swiper = new Swiper(slider, {
    direction: 'vertical',
    speed: 1500,
    grabCursor: true,
    touchRatio: 2,
    threshold: 1,
    preventInteractionOnTransition: true,
    mousewheel: {
        forceToAxis: true,
    },
    keyboard: {
        enabled: true,
    },
    on: {
        init: () => {
            /* SLIDER & TITLE FADE IN */
            gsap.to(slider, {
                duration: 1,
                ease: Power4.easeOut,
                autoAlpha: 1,
            });
            gsap.to(title, innerAnimationActive);

            /* TITLE INFINITE LOOP */
            title.forEach(function (e, i) {
                let row_width = e.getBoundingClientRect().width;
                let row_item_width = e.children[0].getBoundingClientRect().width;
                let offset = ((2 * row_item_width) / row_width) * 100 * -1;
                let duration = 30 * (i + 1);

                gsap.set(e, {
                    xPercent: 0
                });

                gsap.to(e, {
                    duration: duration,
                    ease: "none",
                    xPercent: offset,
                    repeat: -1
                });
            });
        }
    },
});

function isMobileView() {
    return window.innerWidth <= 900;
}

function setCarPosition() {
    const mobile = isMobileView();
    console.log('Is mobile view:', mobile); // Debugging log

    if (mobile) {
        target1 = currentModel.cameraSettings.mobileTarget1;
        target2 = currentModel.cameraSettings.mobileTarget2;
        target3 = currentModel.cameraSettings.mobileTarget3;
    } else {
        target1 = currentModel.cameraSettings.target1;
        target2 = currentModel.cameraSettings.target2;
        target3 = currentModel.cameraSettings.target3;
    }

    console.log('Current targets:', { target1, target2, target3 }); // Debugging log
}

function updateCarPosition() {
    setCarPosition();
    const activeIndex = swiper.activeIndex;
    const mobile = isMobileView();
    
    let orbit, target;
    
    if (mobile) {
        orbit = currentModel.cameraSettings[`mobileOrbit${activeIndex + 1}`] || currentModel.cameraSettings[`orbit${activeIndex + 1}`];
        target = [target1, target2, target3][activeIndex];
    } else {
        orbit = currentModel.cameraSettings[`orbit${activeIndex + 1}`];
        target = [target1, target2, target3][activeIndex];
    }
    
    console.log('Updating car position:', { mobile, orbit, target });
    
    gsap.to(carViewer, carPosition(currentModel.exposure, orbit, target));
}

const carPosition = (exposure, orbit, target) => {
    return {
        duration: 1.5,
        ease: Power4.easeOut,
        attr: {
            ['exposure']: exposure,
            ['camera-orbit']: orbit,
            ['camera-target']: target,
        }
    };
};

function setupCarPositions() {
    setCarPosition();
    updateCarPosition();
}

function loadCarModel(modelKey) {
    currentModel = carModels[modelKey];
    if (!currentModel) {
        console.error(`Model ${modelKey} not found`);
        return;
    }
    
    carViewer.src = currentModel.src;
    
    carViewer.addEventListener('load', () => {
        const materials = carViewer.model.materials;
        if (!materials || materials.length <= Math.max(...currentModel.paintIndices)) {
            console.error('Invalid materials or paint indices');
            return;
        }
        
        window.carPaint1 = materials[currentModel.paintIndices[0]];
        window.carPaint2 = materials[currentModel.paintIndices[1]];
        if(carModelSelector.value=="model3"){
          const color="#000000";
        window.carPaint3 = materials[currentModel.paintIndices[2]];
        window.carPaint4 = materials[currentModel.paintIndices[3]];
        window.carPaint5 = materials[currentModel.paintIndices[4]];
        window.carPaint6 = materials[currentModel.paintIndices[5]];
        window.carPaint7 = materials[currentModel.paintIndices[6]];
        window.carPaint8 = materials[currentModel.paintIndices[7]];
        window.carPaint9 = materials[currentModel.paintIndices[8]];
        window.carPaint3.pbrMetallicRoughness.setBaseColorFactor(color);
        window.carPaint4.pbrMetallicRoughness.setBaseColorFactor(color);
        window.carPaint5.pbrMetallicRoughness.setBaseColorFactor(color);
        window.carPaint6.pbrMetallicRoughness.setBaseColorFactor(color);
        window.carPaint7.pbrMetallicRoughness.setBaseColorFactor(color);
        window.carPaint8.pbrMetallicRoughness.setBaseColorFactor(color);
        window.carPaint9.pbrMetallicRoughness.setBaseColorFactor(color);
        dontknow.innerText="CIAZ";
        }
        if(carModelSelector.value=="model2"){
            dontknow.innerText="SWIFT";
        }

        const initialColor = '#CBD5E1';
        window.carPaint1.pbrMetallicRoughness.setBaseColorFactor(initialColor);
        window.carPaint2.pbrMetallicRoughness.setBaseColorFactor(initialColor);

        carViewer.scale = currentModel.scale;
        carViewer.exposure = currentModel.exposure;

        setupCarPositions();

        /* FADE OUT LOADING SCREEN */
        gsap.to(loading, {
            duration: 1,
            ease: Power4.easeOut,
            autoAlpha: 0,
        });
    }, { once: true });
}

carModelSelector.addEventListener('change', (event) => {
    loadCarModel(event.target.value);
});

// Initial load
loadCarModel(carModelSelector.value);

/* SLIDE CHANGE */
swiper.on('slideChange', function () {
    updateCarPosition();

    if (swiper.activeIndex === 0) {
        page.classList.remove('bg-zinc-900');
        page.classList.add('bg-slate-200');
        gsap.to(inner1, innerAnimationActive);
        gsap.to(title, innerAnimationActive);
    } else {
        gsap.to(inner1, innerAnimationHidden);
        gsap.to(title, innerAnimationHidden);
    }

    if (swiper.activeIndex === 1) {
        page.classList.remove('bg-slate-200');
        page.classList.add('bg-zinc-900');
        gsap.to(inner2, innerAnimationActive);
    } else {
        gsap.to(inner2, innerAnimationHidden);
    }

    if (swiper.activeIndex === 2) {
        page.classList.remove('bg-zinc-900');
        page.classList.add('bg-slate-200');
        gsap.to(inner3, innerAnimationActive);
        gsap.to(bgImage, {
            duration: 1,
            delay: 1,
            ease: Power4.easeOut,
            autoAlpha: 1,
            yPercent: -50,
        });
    } else {
        gsap.to(inner3, innerAnimationHidden);
        gsap.to(bgImage, {
            duration: 0.5,
            ease: Power4.easeOut,
            autoAlpha: 0,
            yPercent: 0,
        });
    }
});

/* WINDOW RESIZE CAR POSITION */
window.addEventListener('resize', setupCarPositions);

/* SLIDE TO */
slideToButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        const index = e.target.dataset.slideTo;
        if (index !== undefined) {
            swiper.slideTo(index);
        }
        e.preventDefault();
    });
});

/* PAINT */
colorButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        const color = e.target.dataset.color;
        if (color !== undefined && window.carPaint1 && window.carPaint2) {
            window.carPaint1.pbrMetallicRoughness.setBaseColorFactor(color);
            window.carPaint2.pbrMetallicRoughness.setBaseColorFactor(color);
        }

        colorButtons.forEach((otherButton) => {
            otherButton.classList.remove('active');
        });
        e.target.classList.add('active');

        e.preventDefault();
    });
});
