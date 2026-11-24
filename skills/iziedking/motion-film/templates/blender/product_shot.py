# A lit product shot built from nothing, for Blender 5.x (tolerant of 4.2 LTS).
#
#   blender -b --factory-startup --python-exit-code 1 -P product_shot.py -- \
#       --out //render/f_ --frames 120 --samples 96 [--model product.glb] [--hdri studio.exr] \
#       [--mode turntable|orbit|coins] [--transparent] [--gpu] [--test]
#
#   --test         render frame 1 only and print the time it took. Always do this first.
#   --transparent  transparent film, for compositing over a 2D plate.
#   --mode coins   a ring of spinning gold coins on a transparent film (a flourish for a headline).
#
# Output is a 16-bit PNG sequence. Encode with FFmpeg afterwards (references/finishing.md).
# Render frames, never straight to video: a crash loses nothing and frames can be redone alone.

import argparse
import math
import sys
import time

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--out", default="//render/f_")
ap.add_argument("--frames", type=int, default=120)
ap.add_argument("--fps", type=int, default=30)
ap.add_argument("--samples", type=int, default=96)
ap.add_argument("--res", type=int, nargs=2, default=[1920, 1080])
ap.add_argument("--model", default="")
ap.add_argument("--hdri", default="")
ap.add_argument("--mode", choices=["turntable", "orbit", "coins"], default="turntable")
ap.add_argument("--transparent", action="store_true")
ap.add_argument("--gpu", action="store_true")
ap.add_argument("--test", action="store_true")
a = ap.parse_args(argv)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# 5.x removed direct f-curve editing on actions; set the interpolation before keying instead.
try:
    bpy.context.preferences.edit.keyframe_new_interpolation_type = 'LINEAR' if a.mode != "orbit" else 'BEZIER'
except (AttributeError, TypeError):
    pass


def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()


def principled(name, **inputs):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True  # required in 4.x, a harmless no-op in 5.x
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    for socket, value in inputs.items():
        if socket in bsdf.inputs:
            bsdf.inputs[socket].default_value = value
    return mat


def area_light(name, loc, watts, sx, sy, target, color=(1, 1, 1)):
    light = bpy.data.lights.new(name, 'AREA')
    light.shape = 'RECTANGLE'
    light.size, light.size_y, light.energy, light.color = sx, sy, watts, color
    obj = bpy.data.objects.new(name, light)
    scene.collection.objects.link(obj)
    obj.location = loc
    look_at(obj, target)
    return obj


target = (0, 0, 0.07)
pivot = bpy.data.objects.new("Pivot", None)
scene.collection.objects.link(pivot)

# ---------- subject ----------
if a.mode == "coins":
    gold = principled("Gold", **{"Base Color": (1.0, 0.60, 0.12, 1), "Metallic": 1.0, "Roughness": 0.25})
    count = 6
    for i in range(count):
        ang = i / count * math.tau
        bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=0.03, depth=0.004,
                                            location=(math.cos(ang) * 0.22, 0, 0.07 + math.sin(ang) * 0.11))
        coin = bpy.context.active_object
        bevel = coin.modifiers.new("Bevel", 'BEVEL')
        bevel.width, bevel.segments = 0.0008, 3
        for poly in coin.data.polygons:
            poly.use_smooth = True
        coin.data.materials.append(gold)
        # Each coin tumbles at its own rate so no two are ever in the same pose.
        coin.rotation_euler = (math.pi / 2 + i * 0.7, i * 1.1, 0)
        coin.keyframe_insert("rotation_euler", frame=1)
        coin.rotation_euler = (math.pi / 2 + i * 0.7 + math.tau * (1 if i % 2 else -1), i * 1.1 + math.tau / 2, 0)
        coin.keyframe_insert("rotation_euler", frame=a.frames + 1)
    a.transparent = True
elif a.model:
    bpy.ops.import_scene.gltf(filepath=a.model)
    for obj in bpy.context.selected_objects:
        if obj.parent is None:
            obj.parent = pivot
else:
    bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=0.035, depth=0.14, location=(0, 0, 0.07))
    product = bpy.context.active_object
    bevel = product.modifiers.new("Bevel", 'BEVEL')
    bevel.width, bevel.segments = 0.004, 4
    for poly in product.data.polygons:
        poly.use_smooth = True
    product.data.materials.append(principled("Anodised", **{
        "Base Color": (0.02, 0.02, 0.025, 1), "Metallic": 1.0, "Roughness": 0.28, "Coat Weight": 0.3}))
    product.parent = pivot

# ---------- floor (skipped when the film is transparent) ----------
if not a.transparent:
    bpy.ops.mesh.primitive_plane_add(size=20)
    bpy.context.active_object.data.materials.append(
        principled("Floor", **{"Base Color": (0.03, 0.03, 0.035, 1), "Roughness": 0.35}))

# ---------- softbox lighting: large key, weak fill, strip rim, soft top ----------
area_light("Key", (0.55, -0.55, 0.60), 40, 0.6, 0.9, target, (1.0, 0.96, 0.92))
area_light("Fill", (-0.70, -0.40, 0.30), 8, 0.9, 0.9, target, (0.92, 0.96, 1.0))
area_light("Rim", (-0.25, 0.65, 0.45), 60, 0.12, 0.9, target)
area_light("Top", (0, 0, 0.9), 12, 0.8, 0.8, target)

# ---------- world: dark, or an HDRI so metals have something to reflect ----------
world = bpy.data.worlds.new("World")
world.use_nodes = True
scene.world = world
background = world.node_tree.nodes["Background"]
if a.hdri:
    env = world.node_tree.nodes.new("ShaderNodeTexEnvironment")
    env.image = bpy.data.images.load(a.hdri)
    world.node_tree.links.new(env.outputs["Color"], background.inputs["Color"])
    background.inputs["Strength"].default_value = 0.6
else:
    # Metals look black in an empty world and washed out in a bright flat one. Without an HDRI, give
    # coins a dim warm-to-dark gradient to reflect; a studio HDRI (--hdri) looks better still.
    if a.mode == "coins":
        nodes, links = world.node_tree.nodes, world.node_tree.links
        coord = nodes.new("ShaderNodeTexCoord")
        sep = nodes.new("ShaderNodeSeparateXYZ")
        ramp = nodes.new("ShaderNodeValToRGB")
        remap = nodes.new("ShaderNodeMapRange")          # generated Z runs -1..1; remap to 0..1
        remap.inputs["From Min"].default_value, remap.inputs["From Max"].default_value = -1.0, 1.0
        ramp.color_ramp.elements[0].color = (0.010, 0.008, 0.006, 1)   # floor: near black
        ramp.color_ramp.elements[1].color = (0.55, 0.42, 0.26, 1)      # overhead: warm card
        links.new(coord.outputs["Generated"], sep.inputs[0])
        links.new(sep.outputs["Z"], remap.inputs["Value"])
        links.new(remap.outputs["Result"], ramp.inputs["Fac"])
        links.new(ramp.outputs["Color"], background.inputs["Color"])
    else:
        background.inputs["Color"].default_value = (0.005, 0.005, 0.0055, 1)

# ---------- camera: 85 mm, depth of field on the subject ----------
cam_data = bpy.data.cameras.new("Cam")
cam_data.lens, cam_data.sensor_width = 85, 36
cam = bpy.data.objects.new("Cam", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
cam.location = (0, -1.25, 0.07) if a.mode == "coins" else (0, -0.62, 0.17)
look_at(cam, target)
focus = bpy.data.objects.new("Focus", None)
scene.collection.objects.link(focus)
focus.location = target
cam_data.dof.use_dof = True
cam_data.dof.focus_object = focus
cam_data.dof.aperture_fstop = 8.0 if a.mode == "coins" else 5.6

# ---------- motion ----------
scene.frame_start, scene.frame_end, scene.render.fps = 1, a.frames, a.fps
if a.mode == "turntable":
    # Rotate the product and keep the lights fixed, so highlights travel across it. Loops seamlessly.
    pivot.rotation_euler = (0, 0, 0)
    pivot.keyframe_insert("rotation_euler", frame=1)
    pivot.rotation_euler = (0, 0, math.tau)
    pivot.keyframe_insert("rotation_euler", frame=a.frames + 1)
elif a.mode == "orbit":
    # A slow eased arc of the camera around the product.
    rig = bpy.data.objects.new("Rig", None)
    scene.collection.objects.link(rig)
    rig.location = target
    cam.parent = rig
    cam.location = (0, -0.62, 0.10)
    look_at(cam, (0, 0, 0))
    rig.rotation_euler = (0, 0, math.radians(-25))
    rig.keyframe_insert("rotation_euler", frame=1)
    rig.rotation_euler = (0, 0, math.radians(25))
    rig.keyframe_insert("rotation_euler", frame=a.frames)

# ---------- render settings ----------
r = scene.render
r.engine = 'CYCLES'
r.resolution_x, r.resolution_y, r.resolution_percentage = a.res[0], a.res[1], 100
r.film_transparent = a.transparent
c = scene.cycles
c.samples = a.samples
c.use_adaptive_sampling = True
c.adaptive_threshold = 0.02
c.use_denoising = True
c.denoiser = 'OPENIMAGEDENOISE'
c.denoising_input_passes = 'RGB_ALBEDO_NORMAL'
c.max_bounces = 8
c.sample_clamp_indirect = 10.0
r.use_persistent_data = True
r.use_motion_blur = True
r.motion_blur_shutter = 0.5  # a 180 degree shutter

if a.gpu:
    prefs = bpy.context.preferences.addons["cycles"].preferences
    for kind in ("OPTIX", "CUDA", "HIP", "ONEAPI", "METAL"):
        try:
            prefs.compute_device_type = kind
        except TypeError:
            continue
        prefs.refresh_devices()
        if any(d.type == kind for d in prefs.devices):
            for d in prefs.devices:
                d.use = (d.type == kind)
            c.device = 'GPU'
            print(f"Rendering on GPU with {kind}")
            break
    else:
        print("No usable GPU found; rendering on the CPU.")

scene.view_settings.view_transform = 'AgX'
try:
    scene.view_settings.look = 'AgX - Medium High Contrast'
except TypeError:
    pass

image = r.image_settings
if hasattr(image, "media_type"):
    image.media_type = 'IMAGE'  # 5.x: must be set before file_format
image.file_format = 'PNG'
image.color_mode = 'RGBA' if a.transparent else 'RGB'
image.color_depth = '16'
r.filepath = a.out

# ---------- go ----------
started = time.time()
if a.test:
    scene.frame_set(1)
    r.filepath = a.out + "test_"
    bpy.ops.render.render(write_still=True)
    took = time.time() - started
    print(f"TEST FRAME: {took:.1f} s. The full shot of {a.frames} frames would take about {took * a.frames / 60:.0f} minutes at these settings.")
else:
    bpy.ops.render.render(animation=True)
    print(f"Rendered {a.frames} frames in {(time.time() - started) / 60:.1f} minutes.")
