import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from "../../tailwind.config.js";
import { computed, onBeforeMount, onUnmounted, ref } from 'vue';
const fullTailwindConfig = resolveConfig(tailwindConfig);
import { mapValues, debounce } from 'lodash';

export function useTailwindBreakpoints() {
    const currentBreakpoint = ref(null);

    const allBreakpoints = mapValues(fullTailwindConfig.theme.screens, (breakpointValue) => parseInt(breakpointValue));
    const sortedBreakpointNames = Object.keys(allBreakpoints)
        .sort((bpA, bpB) => allBreakpoints[bpA] - allBreakpoints[bpB]);

    function updateCurrentBreakpoint() {
        currentBreakpoint.value = sortedBreakpointNames.slice().reverse().find(bp => window.innerWidth >= allBreakpoints[bp])
            || 'mobile';
    }
    updateCurrentBreakpoint();

    const isMobileScreen = computed(() => currentBreakpoint.value === 'mobile');

    onBeforeMount(() => {
        window.addEventListener('resize', debounce(updateCurrentBreakpoint, 50));
    })

    onUnmounted(() => {
        window.removeEventListener('resize', debounce(updateCurrentBreakpoint, 50));
    })

    function getValueForCurrentBreakpoint(breakpointMap) {
        if (isMobileScreen.value) {
            return breakpointMap.mobile;
        }

        let currentBreakpointIdx = sortedBreakpointNames.indexOf(currentBreakpoint.value);
        if (currentBreakpointIdx < 0) {
            return undefined;
        }

        let retVal;
        while (retVal === undefined && currentBreakpointIdx >= 0) {
            retVal = breakpointMap[sortedBreakpointNames[currentBreakpointIdx]];
            currentBreakpointIdx--;
        }
        return retVal ?? breakpointMap.mobile;
    }

    return {
        currentBreakpoint,
        sortedBreakpointNames,
        getValueForCurrentBreakpoint,
        isMobileScreen,
    };
}

