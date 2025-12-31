<script>
	import { cn } from "$lib/utils";
	import { Check } from "lucide-svelte";

	let { class: className, checked = $bindable(false), disabled = false, ...rest } = $props();
</script>

<label class="inline-flex items-center">
	<input type="checkbox" bind:checked {disabled} class="peer sr-only" {...rest} />
	<span
		class={cn(
			"flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary ring-offset-background transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-checked:bg-primary peer-checked:text-primary-foreground",
			className
		)}
	>
		<Check class="h-4 w-4 opacity-0 transition-opacity peer-checked:opacity-100" />
	</span>
</label>
