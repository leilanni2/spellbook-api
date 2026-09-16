import modal

app = modal.App("spellbook-api")

image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install(
        "fastapi",
        "scikit-learn==1.6.1",
        "joblib",
        "numpy",
    )
    .add_local_file("serve.py", "/root/serve.py")
    .add_local_file("pipeline_def.py", "/root/pipeline_def.py")
    .add_local_file("pipeline.joblib", "/root/pipeline.joblib")
)


@app.function(image=image)
@modal.asgi_app()
def fastapi_app():
    import sys

    sys.path.insert(0, "/root")

    from serve import app as web_app

    return web_app
